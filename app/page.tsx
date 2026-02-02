
import { createClient } from '@/utils/supabase/server'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { redirect } from 'next/navigation'
import { Database } from '@/types/supabase'

export default async function Dashboard() {
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

    let totalIncome = 0
    let totalExpenses = 0
    let transactionCount = 0
    let avgTransaction = 0
    let recentTransactions: any[] = []

    // If user has an org, fetch data
    if (userOrg) {
        const orgId = userOrg.organization_id

        // Fetch Stats from View
        const { data: cashflow } = await supabase
            .from('cashflow_monthly')
            .select('*')
            .eq('organization_id', orgId)

        if (cashflow) {
            // Sum up all months for "Total" view (or filter by date if we implemented querying)
            totalIncome = cashflow.reduce((sum, row) => sum + (row.total_income || 0), 0)
            totalExpenses = cashflow.reduce((sum, row) => sum + (row.total_expenses || 0), 0)
        }

        // Fetch Recent Transactions using Promise.all for parallel fetching
        const [expensesRes, incomeRes] = await Promise.all([
            supabase.from('expenses').select('*').eq('organization_id', orgId).order('receipt_date', { ascending: false }).limit(5),
            supabase.from('income').select('*').eq('organization_id', orgId).order('payment_date', { ascending: false }).limit(5)
        ])

        const expenses = expensesRes.data || []
        const income = incomeRes.data || []

        // Combine and sort for "Recent Transactions" list
        recentTransactions = [
            ...expenses.map(e => ({ ...e, type: 'expense', date: e.receipt_date, amount: e.total_amount })),
            ...income.map(i => ({ ...i, type: 'income', date: i.payment_date, amount: i.total_amount }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)

        transactionCount = expenses.length + income.length // Note: this is just local page count, ideally we get count query
        // Simple avg calculation based on fetched window
        const totalFetchedAmount = recentTransactions.reduce((acc, curr) => acc + curr.amount, 0)
        avgTransaction = recentTransactions.length ? totalFetchedAmount / recentTransactions.length : 0
    }

    return (
        <div className="flex h-screen relative">
            <Sidebar />

            <main className="flex-1 overflow-auto ml-64">
                <Header />

                <div className="p-8 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-scale-in">

                        {/* Total Balance (Net Cashflow) */}
                        <div className="stat-card glass-effect rounded-xl p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-accent-purple to-accent-blue rounded-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                                        </path>
                                    </svg>
                                </div>
                                <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">Net</span>
                            </div>
                            <h3 className="text-slate-400 text-sm font-medium mb-1">Net Cashflow</h3>
                            <p className={`text-3xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-white' : 'text-red-400'}`}>
                                ${(totalIncome - totalExpenses).toFixed(2)}
                            </p>
                        </div>

                        {/* Total Expenses */}
                        <div className="stat-card glass-effect rounded-xl p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-accent-green to-accent-cyan rounded-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z">
                                        </path>
                                    </svg>
                                </div>
                                <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full">Out</span>
                            </div>
                            <h3 className="text-slate-400 text-sm font-medium mb-1">Total Expenses</h3>
                            <p className="text-3xl font-bold">${totalExpenses.toFixed(2)}</p>
                        </div>

                        {/* Total Income */}
                        <div className="stat-card glass-effect rounded-xl p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-accent-orange to-accent-pink rounded-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                    </svg>
                                </div>
                                <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">In</span>
                            </div>
                            <h3 className="text-slate-400 text-sm font-medium mb-1">Total Income</h3>
                            <p className="text-3xl font-bold">${totalIncome.toFixed(2)}</p>
                        </div>

                        {/* Avg Transaction (Proxy) */}
                        <div className="stat-card glass-effect rounded-xl p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-gradient-to-br from-accent-cyan to-accent-blue rounded-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
                                        </path>
                                    </svg>
                                </div>
                                <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full"> Recent Avg</span>
                            </div>
                            <h3 className="text-slate-400 text-sm font-medium mb-1">Avg Transaction</h3>
                            <p className="text-3xl font-bold">${avgTransaction.toFixed(2)}</p>
                        </div>

                    </div>

                    {/* Recent Transactions Table */}
                    <div className="glass-effect rounded-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold">Recent Transactions</h3>
                                <p className="text-sm text-slate-400">Latest activity</p>
                            </div>
                            <button className="px-4 py-2 bg-gradient-to-r from-accent-purple to-accent-blue rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-accent-purple/30 transition-all">
                                View All
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-700">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Type</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Date</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Details</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Description</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTransactions.length > 0 ? (
                                        recentTransactions.map((t) => (
                                            <tr key={t.id} className="border-b border-slate-800 hover:bg-slate-900/30 transition-colors">
                                                <td className="py-4 px-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${t.type === 'income' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                                        {t.type.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-sm text-slate-300">{t.date}</td>
                                                <td className="py-4 px-4 text-sm text-slate-300">
                                                    {t.type === 'expense' ? t.vendor_merchant : 'Invoice'}
                                                </td>
                                                <td className="py-4 px-4 text-sm text-slate-400 max-w-xs truncate">{t.description || '-'}</td>
                                                <td className={`py-4 px-4 text-sm font-semibold text-right ${t.type === 'income' ? 'text-green-400' : 'text-white'}`}>
                                                    ${t.amount.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-slate-400">No transactions found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {!userOrg && (
                        <div className="p-4 bg-yellow-900/50 border border-yellow-700 text-yellow-200 rounded-lg">
                            <strong>Notice:</strong> You are not currently assigned to an organization. Please contact an administrator.
                            {/* In a real app, we'd offer a "Create Organization" button here */}
                        </div>
                    )}

                </div>
            </main>
        </div>
    )
}
