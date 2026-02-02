
import { createClient } from '@/utils/supabase/server'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { createTransaction } from './actions'
import { Button, Input, Label } from '@/components/ui/basics'
import { redirect } from 'next/navigation'

export default async function TransactionsPage() {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: userOrg } = await supabase
        .from('user_organizations')
        .select('organization_id')
        .eq('user_id', user.id)
        .single()

    let transactions: any[] = []

    if (userOrg) {
        const [expensesRes, incomeRes] = await Promise.all([
            supabase.from('expenses').select('*').eq('organization_id', userOrg.organization_id).order('receipt_date', { ascending: false }),
            supabase.from('income').select('*').eq('organization_id', userOrg.organization_id).order('payment_date', { ascending: false })
        ])

        const expenses = expensesRes.data || []
        const income = incomeRes.data || []

        transactions = [
            ...expenses.map(e => ({ ...e, type: 'expense', date: e.receipt_date, amount: e.total_amount })),
            ...income.map(i => ({ ...i, type: 'income', date: i.payment_date, amount: i.total_amount }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }

    return (
        <div className="flex h-screen relative">
            <Sidebar />
            <main className="flex-1 overflow-auto ml-64 p-8">
                <Header />

                <div className="max-w-6xl mx-auto space-y-8 mt-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Transactions</h2>
                    </div>

                    {/* Add Transaction Form */}
                    <div className="glass-effect p-6 rounded-xl">
                        <h3 className="text-lg font-semibold mb-4">Add New Transaction</h3>
                        <form action={createTransaction} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
                            <div className="space-y-2">
                                <Label>Type</Label>
                                <select name="type" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                                    <option value="expense" className="bg-slate-900">Expense</option>
                                    <option value="income" className="bg-slate-900">Income</option>
                                </select>
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label>Description</Label>
                                <Input name="description" placeholder="Office Supplies" required />
                            </div>
                            <div className="space-y-2">
                                <Label>Amount</Label>
                                <Input name="amount" type="number" step="0.01" placeholder="0.00" required />
                            </div>
                            <div className="space-y-2">
                                <Label>Date</Label>
                                <Input name="date" type="date" required />
                            </div>
                            <div className="space-y-2">
                                <Label>Receipt</Label>
                                <Input name="receipt" type="file" accept="image/*,.pdf" className="file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-700 file:text-white hover:file:bg-slate-600" />
                            </div>
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <select name="category" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                                    <option value="other_expenses" className="bg-slate-900">Other Expenses</option>
                                    <option value="food_beverage" className="bg-slate-900">Food & Beverage</option>
                                    <option value="utilities" className="bg-slate-900">Utilities</option>
                                    <option value="other_revenue" className="bg-slate-900">Other Revenue</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Button type="submit" className="w-full bg-accent-blue hover:bg-accent-blue/80 text-white">Add</Button>
                            </div>
                        </form>
                    </div>

                    {/* List */}
                    <div className="glass-effect rounded-xl overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-900/50">
                                <tr>
                                    <th className="text-left py-3 px-4 font-semibold text-slate-400">Date</th>
                                    <th className="text-left py-3 px-4 font-semibold text-slate-400">Type</th>
                                    <th className="text-left py-3 px-4 font-semibold text-slate-400">Description</th>
                                    <th className="text-left py-3 px-4 font-semibold text-slate-400">Category</th>
                                    <th className="text-right py-3 px-4 font-semibold text-slate-400">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((t) => (
                                    <tr key={t.id} className="border-t border-slate-800 hover:bg-slate-900/30">
                                        <td className="py-3 px-4 text-slate-300">{t.date}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded text-xs items-center ${t.type === 'income' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {t.type.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-slate-300">{t.description}</td>
                                        <td className="py-3 px-4 text-slate-400 text-sm">{t.category?.replace('_', ' ')}</td>
                                        <td className={`py-3 px-4 text-right font-mono ${t.type === 'income' ? 'text-green-400' : 'text-white'}`}>
                                            {t.type === 'expense' ? '-' : '+'}${t.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                                {transactions.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-slate-500">No transactions recorded yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    )
}
