
export function Header() {
    return (
        <header className="glass-effect-light sticky top-0 z-10 px-8 py-4 flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-slate-400 text-sm">Welcome back! Here's your expense overview</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <input type="search" placeholder="Search transactions..."
                        className="w-64 px-4 py-2 pl-10 bg-slate-900/50 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent" />
                    <svg className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </div>
                <button className="relative p-2 bg-slate-900/50 rounded-lg hover:bg-slate-800 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9">
                        </path>
                    </svg>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-accent-pink rounded-full"></span>
                </button>
            </div>
        </header>
    )
}
