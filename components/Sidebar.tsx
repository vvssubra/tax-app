import Link from 'next/link'

export function Sidebar() {
    return (
        <aside className="w-64 glass-effect p-6 flex flex-col animate-slide-in h-screen fixed left-0 top-0 z-20">
            <div className="mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-accent-purple to-accent-blue rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z">
                            </path>
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">TaxDash</h2>
                        <p className="text-xs text-slate-400">Expense Manager</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 space-y-2">
                <Link href="/"
                    className="sidebar-item flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-accent-purple/20 to-accent-blue/20 text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6">
                        </path>
                    </svg>
                    <span className="font-medium">Dashboard</span>
                </Link>
                <Link href="/transactions"
                    className="sidebar-item flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
                        </path>
                    </svg>
                    <span className="font-medium">Transactions</span>
                </Link>
                <Link href="/analytics"
                    className="sidebar-item flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                        </path>
                    </svg>
                    <span className="font-medium">Analytics</span>
                </Link>

                <Link href="/team"
                    className="sidebar-item flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    <span className="font-medium">Team</span>
                </Link>
                <Link href="/reports"
                    className="sidebar-item flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                        </path>
                    </svg>
                    <span className="font-medium">Reports</span>
                </Link>
                <Link href="/pricing"
                    className="sidebar-item flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z">
                        </path>
                    </svg>
                    <span className="font-medium">Billing</span>
                </Link>
            </nav>

            <div className="mt-auto pt-6 border-t border-slate-700">
                <form action="/auth/signout" method="post">
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1">
                            </path>
                        </svg>
                        Logout
                    </button>
                </form>
            </div>
        </aside>
    )
}
