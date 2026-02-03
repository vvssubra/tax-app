import { createClient } from '@/utils/supabase/server'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { redirect } from 'next/navigation'
import { getSubscription } from '@/utils/stripe/queries'
import Link from 'next/link'

export default async function AnalyticsPage() {
    const supabase = createClient()

    // 1. Get Auth User
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    // 2. Get User's Organization
    const { data: userOrg } = await supabase
        .from('user_organizations')
        .select('organization_id')
        .eq('user_id', user.id)
        .single()

    if (!userOrg) {
        redirect('/onboarding')
    }

    const subscription = await getSubscription(userOrg.organization_id)
    const isPro = subscription?.status === 'active' || subscription?.status === 'trialing'

    return (
        <div className="flex h-screen relative">
            <Sidebar />

            <main className="flex-1 overflow-auto ml-64">
                <Header />

                <div className="p-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Analytics Oversight</h1>
                            <p className="text-slate-400">Deep dive into your financial performance.</p>
                        </div>
                    </div>

                    {/* Analytics Content with Pro Lock if applicable */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                        {!isPro && (
                            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md z-10 flex flex-col items-center justify-center rounded-2xl border border-slate-700/50 p-8 text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-accent-purple to-accent-blue rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002-2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Advanced Analytics</h3>
                                <p className="text-slate-300 max-w-sm mb-6">
                                    Unlock powerful insights, trend analysis, and predictive forecasting with a Pro subscription.
                                </p>
                                <Link
                                    href="/pricing"
                                    className="px-8 py-3 bg-gradient-to-r from-accent-purple to-accent-blue rounded-xl font-bold hover:shadow-lg hover:shadow-accent-purple/30 transition-all"
                                >
                                    Upgrade to Pro
                                </Link>
                            </div>
                        )}

                        {/* Placeholder Charts for Visual Experience */}
                        <div className="glass-effect rounded-2xl p-6 border border-slate-700/50 min-h-[400px] flex flex-col">
                            <h3 className="text-lg font-semibold mb-6">Revenue Growth</h3>
                            <div className="flex-1 flex items-end gap-2 px-4 pb-4">
                                {[40, 65, 45, 90, 85, 100, 75, 80, 95, 110, 105, 120].map((h, i) => (
                                    <div
                                        key={i}
                                        style={{ height: `${h}%` }}
                                        className="flex-1 bg-gradient-to-t from-accent-blue to-accent-purple rounded-t-sm opacity-80"
                                    ></div>
                                ))}
                            </div>
                            <div className="flex justify-between text-xs text-slate-500 mt-2 px-4">
                                <span>Jan</span>
                                <span>Jun</span>
                                <span>Dec</span>
                            </div>
                        </div>

                        <div className="glass-effect rounded-2xl p-6 border border-slate-700/50 min-h-[400px] flex flex-col">
                            <h3 className="text-lg font-semibold mb-6">Expense Distribution</h3>
                            <div className="flex-1 flex items-center justify-center">
                                <div className="w-48 h-48 rounded-full border-[20px] border-accent-blue/20 relative">
                                    <div className="absolute inset-0 rounded-full border-[20px] border-accent-purple border-l-transparent border-b-transparent -rotate-45"></div>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-2xl font-bold">65%</span>
                                        <span className="text-xs text-slate-400">Fixed Costs</span>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-accent-purple"></div>
                                    <span className="text-sm text-slate-400 font-medium">Operations</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-accent-blue"></div>
                                    <span className="text-sm text-slate-400 font-medium">Marketing</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-effect rounded-2xl p-8 border border-slate-700/50">
                        <h3 className="text-xl font-bold mb-4">Financial Health Score</h3>
                        <div className="flex items-center gap-6">
                            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-accent-blue">
                                8.4
                            </div>
                            <div className="flex-1">
                                <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full w-[84%] bg-gradient-to-r from-green-400 to-accent-blue"></div>
                                </div>
                                <p className="text-sm text-slate-400 mt-2">
                                    Your business is in excellent health. You are in the top 15% of businesses in your sector.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
