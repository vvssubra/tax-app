import { createOrganization } from './actions'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function Onboarding({
    searchParams,
}: {
    searchParams: { message: string, error: string }
}) {
    // 1. Check for invites and accept if any
    const supabase = createClient()

    // We can confidently call this because we know the user is authenticated (middleware)
    // and has no organization (page.tsx redirect).

    const { data: acceptResult, error: acceptError } = await supabase
        .rpc('accept_my_invite')

    // If accepted successfully (or user already joined via race condition)
    // The RPC returns { success: true }
    if (acceptResult && acceptResult.success) {
        redirect('/')
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-8">
            <div className="max-w-md w-full glass-effect p-8 rounded-xl space-y-6">
                <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent-purple to-accent-blue rounded-lg flex items-center justify-center mx-auto">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m8-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2m4-2V7a2 2 0 012-2h3">
                            </path>
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold">Welcome to TaxDash</h1>
                    <p className="text-slate-400">Let's set up your company workspace.</p>
                </div>

                <form action={createOrganization} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="orgName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Company Name
                        </label>
                        <input
                            id="orgName"
                            name="orgName"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            placeholder="Acme Corp"
                            required
                        />
                    </div>

                    <button className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
                        Create Workspace
                    </button>
                </form>

                {(searchParams?.message || searchParams?.error) && (
                    <p className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded text-sm text-center">
                        {searchParams.message || searchParams.error}
                    </p>
                )}

                <div className="text-center text-xs text-slate-500 mt-4">
                    <p>Or wait for an invitation from your team admin.</p>
                </div>
            </div>
        </div>
    )
}
