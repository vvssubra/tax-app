import Link from 'next/link'
import { login, signup, signInWithGoogle } from './actions'

export default function Login({
    searchParams,
}: {
    searchParams: { message: string }
}) {
    return (
        <div className="relative min-h-screen flex items-center justify-center p-4">
            {/* Professional SaaS Background */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
                style={{
                    backgroundImage: 'url("/login-bg.png")',
                    backgroundColor: '#0f172a'
                }}
            >
                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"></div>
            </div>

            <div className="z-10 w-full max-w-md">
                <div className="glass-effect p-8 rounded-2xl border border-white/10 shadow-2xl animate-in">
                    <form
                        className="flex flex-col w-full gap-4 text-foreground"
                        action={login}
                    >
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                TaxDash
                            </h1>
                            <p className="text-slate-400 text-sm">Sign in to your account to continue</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-slate-300 ml-1" htmlFor="email">
                                    Email Address
                                </label>
                                <input
                                    className="w-full rounded-xl px-4 py-3 bg-slate-900/50 border border-slate-700/50 focus:border-accent-purple/50 focus:ring-2 focus:ring-accent-purple/20 transition-all outline-none mt-1"
                                    name="email"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-300 ml-1" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    className="w-full rounded-xl px-4 py-3 bg-slate-900/50 border border-slate-700/50 focus:border-accent-purple/50 focus:ring-2 focus:ring-accent-purple/20 transition-all outline-none mt-1"
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="mt-4 flex flex-col gap-3">
                            <button className="w-full py-3 bg-gradient-to-r from-accent-purple to-accent-blue hover:from-accent-purple/90 hover:to-accent-blue/90 text-white rounded-xl font-bold shadow-lg shadow-accent-purple/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                                Sign In
                            </button>
                            <button
                                formAction={signup}
                                className="w-full py-3 bg-slate-800/50 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl font-semibold transition-all"
                            >
                                Create Account
                            </button>
                        </div>

                        {searchParams?.message && (
                            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center rounded-lg">
                                {searchParams.message}
                            </div>
                        )}
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase px-2 text-slate-500 font-medium bg-transparent">
                            <span className="bg-[#1a202c] px-2 rounded-full">Or continue with</span>
                        </div>
                    </div>

                    <form action={signInWithGoogle}>
                        <button
                            className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold py-3 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Google
                        </button>
                    </form>
                </div>

                {/* Powered by Footer */}
                <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <Link
                        href="https://www.vvsdigitalsolutions.com"
                        target="_blank"
                        className="text-slate-500 text-sm hover:text-slate-300 transition-colors flex items-center justify-center gap-1 group"
                    >
                        <span>Powered by</span>
                        <span className="font-bold border-b border-transparent group-hover:border-slate-300">vvsdigitalsolutions.com</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}
