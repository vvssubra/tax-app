'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = createClient()

    // For demo purposes, we accept any email/password if the Supabase project
    // hasn't been set up yet, but in a real app this will hit the auth server.
    // Since we don't have the user's Supabase credentials, we'll code this 
    // defensively to allow the UI to work (mock) if connection fails.

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    // DEMO MODE: If connection fails or invalid creds (and we want to allow demo access)
    // we would handle that here. For now, strict auth.
    if (error) {
        if (email.endsWith('@demo.com')) {
            // Allow demo user bypass if real auth fails (optional, good for dev)
            // But for now, we should return the error
        }
        return redirect('/login?message=Could not authenticate user')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
    const supabase = createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
        },
    })

    if (error) {
        return redirect('/login?message=Could not authenticate user')
    }

    return redirect('/login?message=Check email to continue sign in process')
}

export async function signInWithGoogle() {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/auth/callback`,
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
        },
    })

    if (error) {
        return redirect('/login?message=Could not initiate Google Login')
    }

    return redirect(data.url)
}
