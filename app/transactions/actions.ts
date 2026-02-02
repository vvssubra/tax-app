'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createTransaction(formData: FormData) {
    const supabase = createClient()

    // 1. Get User Org
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data: userOrg } = await supabase
        .from('user_organizations')
        .select('organization_id')
        .eq('user_id', user.id)
        .single()

    if (!userOrg) throw new Error('No Organization Found')

    const type = formData.get('type') as 'expense' | 'income'
    const amount = parseFloat(formData.get('amount') as string)
    const description = formData.get('description') as string
    const date = formData.get('date') as string
    const category = formData.get('category') as string
    const vendor = formData.get('vendor') as string // For expense

    // Basic validation
    if (!amount || !date || !category) {
        // In a real app we'd return form errors
        return redirect('/transactions?error=Missing required fields')
    }

    if (type === 'expense') {
        let receiptUrl = null

        const receiptFile = formData.get('receipt') as File
        if (receiptFile && receiptFile.size > 0) {
            // Upload to Supabase Storage
            const filename = `${userOrg.organization_id}/${Date.now()}-${receiptFile.name}`
            const { error: uploadError } = await supabase.storage
                .from('receipts')
                .upload(filename, receiptFile)

            if (uploadError) {
                console.error('Upload Error:', uploadError)
                // Continue without receipt or return error? Let's continue but warn
            } else {
                const { data: { publicUrl } } = supabase.storage
                    .from('receipts')
                    .getPublicUrl(filename)
                receiptUrl = publicUrl
            }
        }

        const { error } = await supabase.from('expenses').insert({
            organization_id: userOrg.organization_id,
            receipt_date: date,
            total_amount: amount,
            subtotal_amount: amount, // Simplifying for demo
            description,
            category,
            vendor_merchant: vendor || 'Unknown',
            status: 'pending',
            created_by: user.id,
            receipt_url: receiptUrl
        })
        if (error) {
            console.error(error)
            return redirect('/transactions?error=' + encodeURIComponent(error.message))
        }
    } else {
        const { error } = await supabase.from('income').insert({
            organization_id: userOrg.organization_id,
            payment_date: date,
            total_amount: amount,
            unit_price: amount,
            description,
            category,
            status: 'received',
            created_by: user.id
        })
        if (error) {
            console.error(error)
            return redirect('/transactions?error=' + encodeURIComponent(error.message))
        }
    }

    revalidatePath('/')
    revalidatePath('/transactions')
    redirect('/transactions')
}
