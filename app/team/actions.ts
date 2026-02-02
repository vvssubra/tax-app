'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function inviteUser(formData: FormData) {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    const email = formData.get('email') as string
    if (!email) {
        return redirect('/team?error=Email is required')
    }

    // Get current User's Org (assuming 1 org for now)
    const { data: userOrg } = await supabase
        .from('user_organizations')
        .select('organization_id')
        .eq('user_id', user.id)
        .single()

    if (!userOrg) return redirect('/team?error=No Organization found')

    const { error } = await supabase
        .from('organization_invites')
        .insert({
            organization_id: userOrg.organization_id,
            email: email,
            role: 'member'
        })

    if (error) {
        console.error(error)
        return redirect('/team?error=Failed to invite user: ' + error.message)
    }

    revalidatePath('/team')
    redirect('/team?message=Invite sent to ' + email)
}
