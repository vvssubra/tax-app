'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function createOrganization(formData: FormData) {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const orgName = formData.get('orgName') as string

    if (!orgName) {
        return redirect('/onboarding?error=Company Name is required')
    }

    // 1. Create Organization
    const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({ name: orgName })
        .select()
        .single()

    if (orgError) {
        console.error(orgError)
        return redirect('/onboarding?error=Failed to create organization')
    }

    // 2. Link User to Organization as Owner
    const { error: linkError } = await supabase
        .from('user_organizations')
        .insert({
            user_id: user.id,
            organization_id: org.id,
            role: 'owner'
        })

    if (linkError) {
        console.error(linkError)
        // Rollback? ideally yes, but for now just error out
        return redirect('/onboarding?error=Failed to link user to organization')
    }

    redirect('/')
}
