
import { createClient } from '@/utils/supabase/server'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSubscription } from '@/utils/stripe/queries'

export default async function BalanceSheetPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: userOrg } = await supabase.from('user_organizations').select('organization_id').eq('user_id', user.id).single()
    if (!userOrg) redirect('/')

    const subscription = await getSubscription(userOrg.organization_id)
    const isPro = subscription?.status === 'active' || subscription?.status === 'trialing'

    // Fetch Last 5 Years of Data
    const { data: yearlyData } = await supabase
        .from('cashflow_yearly')
        .select('*')
        .eq('organization_id', userOrg.organization_id)
        .order('year', { ascending: false }) // Newest first
        .limit(5)

    // Normalize data (ensure we have 5 years or handle empty)
    // For display, we usually want Newest -> Oldest (left to right) or Oldest -> Newest?
    // User asked for "trace back 5 years". Usually typical is columns: 2024, 2023, 2022...

    const years = yearlyData || []

    return (
        <div className="flex h-screen relative">
            <Sidebar />
            <main className="flex-1 overflow-auto ml-64 p-8">
                <Header />
                <div className="max-w-6xl mx-auto space-y-8 mt-6">
                    <div className="flex items-center gap-4">
                        <Link href="/reports" className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                        </Link>
                        <h2 className="text-2xl font-bold">Balance Sheet (5-Year Overview)</h2>
                    </div>

                    <div className="glass-effect rounded-xl p-8 relative overflow-hidden">
                        {!isPro && (
                            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md z-10 flex flex-col items-center justify-center p-6 text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-accent-purple to-accent-blue rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002-2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Pro Report</h3>
                                <p className="text-slate-300 max-w-sm mb-6">
                                    Detailed 5-year balance sheets are only available for Pro subscribers.
                                </p>
                                <Link
                                    href="/pricing"
                                    className="px-8 py-3 bg-gradient-to-r from-accent-purple to-accent-blue rounded-xl font-bold hover:shadow-lg hover:shadow-accent-purple/30 transition-all"
                                >
                                    Unlock with Pro
                                </Link>
                            </div>
                        )}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th className="py-4 px-6 text-slate-400 border-b border-slate-700 w-1/3">Item</th>
                                        {years.map(y => (
                                            <th key={y.year} className="py-4 px-6 font-bold text-white border-b border-slate-700 text-right">
                                                {new Date(y.year).getFullYear()}
                                            </th>
                                        ))}
                                        {/* Fill empty columns if less than 5 years? Optional */}
                                        {years.length === 0 && <th className="py-4 px-6 text-slate-500 border-b border-slate-700 text-right">No Data</th>}
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {/* REVENUE SECTION */}
                                    <tr>
                                        <td className="py-4 px-6 font-semibold text-slate-200 bg-slate-800/20" colSpan={years.length + 1}>Revenue</td>
                                    </tr>
                                    <tr className="hover:bg-white/5">
                                        <td className="py-3 px-6 text-slate-300">Total Income</td>
                                        {years.map(y => (
                                            <td key={y.year} className="py-3 px-6 text-right text-green-400 font-mono">
                                                ${y.total_income?.toLocaleString()}
                                            </td>
                                        ))}
                                    </tr>

                                    {/* EXPENSES SECTION */}
                                    <tr>
                                        <td className="py-4 px-6 font-semibold text-slate-200 bg-slate-800/20" colSpan={years.length + 1}>Operating Expenses</td>
                                    </tr>
                                    <tr className="hover:bg-white/5">
                                        <td className="py-3 px-6 text-slate-300">Total Expenses</td>
                                        {years.map(y => (
                                            <td key={y.year} className="py-3 px-6 text-right text-slate-200 font-mono">
                                                ${y.total_expenses?.toLocaleString()}
                                            </td>
                                        ))}
                                    </tr>

                                    {/* NET INCOME */}
                                    <tr className="border-t-2 border-slate-700">
                                        <td className="py-4 px-6 font-bold text-white">Net Income</td>
                                        {years.map(y => (
                                            <td key={y.year} className={`py-4 px-6 text-right font-bold font-mono text-lg ${(y.net_cashflow || 0) >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                                                ${y.net_cashflow?.toLocaleString()}
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg flex gap-3 text-blue-300 text-sm">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <p>
                            This Balance Sheet is generated from your Cashflow views. To trace back more years, simply ensure previous years' data is imported into the <strong>Transactions</strong> page. The system automatically aggregates it.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}
