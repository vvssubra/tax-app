
import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'

export default async function DebugPage() {
    const supabase = createClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    const { data: { user } } = await supabase.auth.getUser()

    const headersList = headers()
    const host = headersList.get('host')
    const protocol = headersList.get('x-forwarded-proto') || 'http'

    return (
        <div className="p-8 text-white bg-slate-900 min-h-screen font-mono">
            <h1 className="text-2xl font-bold mb-4">Debug Auth</h1>

            <div className="mb-8 p-4 border border-slate-700 rounded">
                <h2 className="text-xl mb-2">Environment</h2>
                <p>Base URL (Derived): {protocol}://{host}</p>
                <p>NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
                {/* Do not show anon key fully */}
                <p>NEXT_PUBLIC_BASE_URL: {process.env.NEXT_PUBLIC_BASE_URL}</p>
            </div>

            <div className="mb-8 p-4 border border-slate-700 rounded">
                <h2 className="text-xl mb-2">Auth State</h2>
                <p>User Authenticated: <span className={user ? "text-green-400" : "text-red-400"}>{user ? 'YES' : 'NO'}</span></p>
                <p>User Email: {user?.email || 'N/A'}</p>
                <p>User ID: {user?.id || 'N/A'}</p>
                {error && <p className="text-red-400">Session Error: {error.message}</p>}
            </div>

            <div className="p-4 border border-slate-700 rounded">
                <h2 className="text-xl mb-2">Troubleshooting</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li>If User is NO: You are not logged in.</li>
                    <li>If User is YES but redirected to Login: Middleware issue.</li>
                    <li>If Google Login fails: Check Supabase URL Configuration.</li>
                </ul>
            </div>
        </div>
    )
}
