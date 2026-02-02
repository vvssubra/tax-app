
import { createClient } from '@/utils/supabase/server'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { inviteUser } from './actions'
import { Button, Input, Label } from '@/components/ui/basics'
import { redirect } from 'next/navigation'

export default async function TeamPage({
    searchParams,
}: {
    searchParams: { message: string, error: string }
}) {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: userOrg } = await supabase
        .from('user_organizations')
        .select('organization_id, role')
        .eq('user_id', user.id)
        .single()

    let invites: any[] = []
    let members: any[] = [] // In a real app we'd fetch profiles

    if (userOrg) {
        const { data } = await supabase
            .from('organization_invites')
            .select('*')
            .eq('organization_id', userOrg.organization_id)
            .order('created_at', { ascending: false })

        invites = data || []
    }

    return (
        <div className="flex h-screen relative">
            <Sidebar />
            <main className="flex-1 overflow-auto ml-64 p-8">
                <Header />

                <div className="max-w-4xl mx-auto space-y-8 mt-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold">Team Management</h2>
                            <p className="text-slate-400">Invite colleagues to your organization.</p>
                        </div>
                    </div>

                    {/* Invite Form */}
                    <div className="glass-effect p-6 rounded-xl">
                        <h3 className="text-lg font-semibold mb-4">Invite New Member</h3>
                        <form action={inviteUser} className="flex gap-4 items-end">
                            <div className="space-y-2 flex-1">
                                <Label>Email Address</Label>
                                <Input name="email" type="email" placeholder="colleague@company.com" required />
                            </div>
                            <Button type="submit" className="bg-accent-purple hover:bg-accent-purple/80 text-white">
                                Send Invite
                            </Button>
                        </form>
                        {(searchParams?.message || searchParams?.error) && (
                            <p className={`mt-4 p-3 rounded text-sm ${searchParams.error ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                                {searchParams.message || searchParams.error}
                            </p>
                        )}
                    </div>

                    {/* Invites List */}
                    <div className="glass-effect rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-800">
                            <h3 className="font-semibold">Pending Invites</h3>
                        </div>
                        <table className="w-full">
                            <thead className="bg-slate-900/50">
                                <tr>
                                    <th className="text-left py-3 px-6 font-semibold text-slate-400">Email</th>
                                    <th className="text-left py-3 px-6 font-semibold text-slate-400">Role</th>
                                    <th className="text-left py-3 px-6 font-semibold text-slate-400">Status</th>
                                    <th className="text-right py-3 px-6 font-semibold text-slate-400">Sent</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invites.map((invite) => (
                                    <tr key={invite.id} className="border-t border-slate-800 hover:bg-slate-900/30">
                                        <td className="py-3 px-6 text-slate-300">{invite.email}</td>
                                        <td className="py-3 px-6 text-slate-400 badge"><span className="bg-slate-800 px-2 py-1 rounded text-xs">Member</span></td>
                                        <td className="py-3 px-6">
                                            <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs">
                                                Pending
                                            </span>
                                        </td>
                                        <td className="py-3 px-6 text-right text-slate-500 text-sm">
                                            {new Date(invite.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                                {invites.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-slate-500">No pending invites.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* TODO: Members List (Would require Profiles table or similar to show names/emails of existing members) */}
                </div>
            </main>
        </div>
    )
}
