
import { createClient } from '@/utils/supabase/server'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ReportsPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: userOrg } = await supabase.from('user_organizations').select('organization_id').eq('user_id', user.id).single()
    if (!userOrg) redirect('/')

    // Fetch Summaries
    const { data: monthlyData } = await supabase.from('cashflow_monthly').select('*').eq('organization_id', userOrg.organization_id).order('month', { ascending: false }).limit(6)
    const { data: quarterlyData } = await supabase.from('cashflow_quarterly').select('*').eq('organization_id', userOrg.organization_id).order('quarter', { ascending: false }).limit(4)
    const { data: yearlyData } = await supabase.from('cashflow_yearly').select('*').eq('organization_id', userOrg.organization_id).order('year', { ascending: false }).limit(5)

    return (
        <div className="flex h-screen relative">
            <Sidebar />
            <main className="flex-1 overflow-auto ml-64 p-8">
                <Header />
                <div className="max-w-6xl mx-auto space-y-8 mt-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Financial Reports</h2>
                        <div className="flex gap-2">
                            <Link href="/reports/balance-sheet" className="bg-accent-blue hover:bg-accent-blue/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                View Balance Sheet (5 Years)
                            </Link>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-effect p-6 rounded-xl">
                            <h3 className="text-slate-400 text-sm mb-2">YTD Income</h3>
                            <p className="text-2xl font-bold text-green-400">
                                ${yearlyData?.[0]?.total_income?.toLocaleString() || '0.00'}
                            </p>
                        </div>
                        <div className="glass-effect p-6 rounded-xl">
                            <h3 className="text-slate-400 text-sm mb-2">YTD Expenses</h3>
                            <p className="text-2xl font-bold text-white">
                                ${yearlyData?.[0]?.total_expenses?.toLocaleString() || '0.00'}
                            </p>
                        </div>
                        <div className="glass-effect p-6 rounded-xl">
                            <h3 className="text-slate-400 text-sm mb-2">YTD Net Cashflow</h3>
                            <p className={`text-2xl font-bold ${(yearlyData?.[0]?.net_cashflow || 0) >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                                ${yearlyData?.[0]?.net_cashflow?.toLocaleString() || '0.00'}
                            </p>
                        </div>
                    </div>

                    {/* Quarterly Summary */}
                    <div className="glass-effect rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-4">Quarterly Performance</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-slate-400 border-b border-slate-700">
                                    <tr>
                                        <th className="pb-3">Quarter</th>
                                        <th className="pb-3 text-right">Income</th>
                                        <th className="pb-3 text-right">Expenses</th>
                                        <th className="pb-3 text-right">Net</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {quarterlyData?.map((q: any) => (
                                        <tr key={q.quarter} className="border-b border-slate-800/50 last:border-0 hover:bg-white/5">
                                            <td className="py-3 text-slate-300">
                                                {new Date(q.quarter).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                                            </td>
                                            <td className="py-3 text-right text-green-400">${q.total_income?.toLocaleString()}</td>
                                            <td className="py-3 text-right text-slate-200">${q.total_expenses?.toLocaleString()}</td>
                                            <td className={`py-3 text-right ${(q.net_cashflow || 0) >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                                                ${q.net_cashflow?.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Monthly Summary */}
                    <div className="glass-effect rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-4">Monthly Breakdown (Last 6 Months)</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-slate-400 border-b border-slate-700">
                                    <tr>
                                        <th className="pb-3">Month</th>
                                        <th className="pb-3 text-right">Income</th>
                                        <th className="pb-3 text-right">Expenses</th>
                                        <th className="pb-3 text-right">Net</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {monthlyData?.map((m: any) => (
                                        <tr key={m.month} className="border-b border-slate-800/50 last:border-0 hover:bg-white/5">
                                            <td className="py-3 text-slate-300">
                                                {new Date(m.month).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                                            </td>
                                            <td className="py-3 text-right text-green-400">${m.total_income?.toLocaleString()}</td>
                                            <td className="py-3 text-right text-slate-200">${m.total_expenses?.toLocaleString()}</td>
                                            <td className={`py-3 text-right ${(m.net_cashflow || 0) >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
                                                ${m.net_cashflow?.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
