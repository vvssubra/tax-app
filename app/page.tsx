import Link from 'next/link';
import Image from 'next/image';
import {
    Calculator,
    ShieldCheck,
    BarChart3,
    ArrowRight,
    CheckCircle2,
    Zap,
    Globe,
    Database
} from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-accent-purple/30">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 glass-effect border-b border-white/5 py-4 px-8">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-accent-purple to-accent-blue rounded-lg flex items-center justify-center shadow-lg shadow-accent-purple/20 group-hover:scale-110 transition-transform">
                            <Calculator className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">TaxDash</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <Link href="#features" className="hover:text-white transition-colors">Features</Link>
                        <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
                        <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm font-medium hover:text-white transition-colors">
                            Login
                        </Link>
                        <Link
                            href="/login"
                            className="bg-white text-slate-950 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-200 transition-all hover:shadow-lg hover:shadow-white/10"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            <main>
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 px-8 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-accent-purple/20 via-accent-blue/10 to-transparent blur-3xl -z-10 opacity-50"></div>

                    <div className="max-w-7xl mx-auto text-center space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            <Zap className="w-3 h-3" />
                            Next-Gen Tax Management
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                            Simplify Your Tax Filing <br className="hidden md:block" />
                            <span className="bg-gradient-to-r from-accent-purple to-accent-blue bg-clip-text text-transparent">With Infinite Precision.</span>
                        </h1>

                        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                            A powerful AI-driven platform designed to automate your financial calculations, secure your documents, and maximize your returns.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                            <Link
                                href="/login"
                                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-accent-purple to-accent-blue rounded-full font-extrabold text-white shadow-xl shadow-accent-purple/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                Start Free Trial <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/pricing"
                                className="w-full sm:w-auto px-8 py-4 glass-effect border border-white/10 rounded-full font-bold hover:bg-white/5 transition-all"
                            >
                                View Pricing
                            </Link>
                        </div>

                        {/* Product Image Placeholder */}
                        <div className="relative mt-20 max-w-5xl mx-auto animate-in fade-in zoom-in duration-1000 delay-500">
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10"></div>
                            <div className="rounded-2xl border border-white/10 bg-slate-900 shadow-2xl overflow-hidden p-2">
                                <img
                                    src="/hero-dashboard.png"
                                    alt="TaxDash Dashboard"
                                    className="w-full h-auto rounded-xl grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24 px-8 bg-slate-900/30">
                    <div className="max-w-7xl mx-auto space-y-16">
                        <div className="text-center space-y-4">
                            <h2 className="text-sm font-bold text-accent-blue uppercase tracking-[0.2em]">Key Benefits</h2>
                            <p className="text-3xl md:text-4xl font-black text-white">Everything you need to scale.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: <BarChart3 className="w-10 h-10 text-accent-purple" />,
                                    title: "Automated Calculations",
                                    description: "Leverage advanced algorithms to instantly calculate tax liabilities with zero error margin."
                                },
                                {
                                    icon: <ShieldCheck className="w-10 h-10 text-accent-blue" />,
                                    title: "Secure Document Storage",
                                    description: "Bank-grade encryption ensures your financial documents and sensitive data remain private and protected."
                                },
                                {
                                    icon: <Calculator className="w-10 h-10 text-accent-pink" />,
                                    title: "Real-time Reporting",
                                    description: "Get instant insights into your cash flow, balance sheets, and tax status at any point in the year."
                                },
                                {
                                    icon: <Database className="w-10 h-10 text-green-400" />,
                                    title: "Seamless Integration",
                                    description: "Connect your bank accounts and accounting software for a unified financial view."
                                },
                                {
                                    icon: <Globe className="w-10 h-10 text-orange-400" />,
                                    title: "Global Compliance",
                                    description: "Stay ahead of regulations with automated updates tailored to your specific region and tax laws."
                                },
                                {
                                    icon: <Zap className="w-10 h-10 text-yellow-400" />,
                                    title: "Instant Filing",
                                    description: "Submit your taxes directly through our platform to save days of manual paperwork."
                                }
                            ].map((feature, i) => (
                                <div key={i} className="glass-effect p-8 rounded-2xl border border-white/5 hover:border-white/20 transition-all group">
                                    <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-4 text-white">{feature.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="py-24 px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h2 className="text-sm font-bold text-accent-purple uppercase tracking-[0.2em]">Workflow</h2>
                                    <p className="text-4xl md:text-5xl font-black text-white leading-tight">Simplified in three <br />elegant steps.</p>
                                </div>

                                <div className="space-y-8">
                                    {[
                                        { step: "01", title: "Connect Accounts", desc: "Securely link your bank and accounting tools in minutes." },
                                        { step: "02", title: "Review Data", desc: "Our AI categorizes and optimizes every single transaction." },
                                        { step: "03", title: "File Instantly", desc: "Review your final reports and file directly to the tax authorities." }
                                    ].map((s, i) => (
                                        <div key={i} className="flex gap-6">
                                            <div className="text-2xl font-black text-slate-700">{s.step}</div>
                                            <div className="space-y-2">
                                                <h4 className="text-xl font-bold text-white">{s.title}</h4>
                                                <p className="text-slate-400">{s.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute -inset-4 bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 blur-2xl rounded-3xl"></div>
                                <div className="relative glass-effect p-4 rounded-3xl border border-white/10">
                                    <img
                                        src="/hero-dashboard.png"
                                        alt="Process Illustration"
                                        className="rounded-2xl"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="py-24 px-8 bg-slate-900/40">
                    <div className="max-w-7xl mx-auto space-y-16">
                        <div className="text-center space-y-4">
                            <h2 className="text-sm font-bold text-accent-pink uppercase tracking-[0.2em]">Pricing Plans</h2>
                            <p className="text-3xl md:text-4xl font-black text-white">Choose the best plan for your scale.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {/* Starter Plan */}
                            <div className="glass-effect p-10 rounded-3xl border border-white/5 flex flex-col h-full relative overflow-hidden group">
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
                                    <p className="text-slate-400 text-sm">Perfect for individuals and freelancers.</p>
                                </div>
                                <div className="mb-8 flex items-baseline gap-1">
                                    <span className="text-5xl font-black text-white">$0</span>
                                    <span className="text-slate-500">/mo</span>
                                </div>
                                <ul className="space-y-4 mb-10 flex-1">
                                    {["Basic Expense Tracking", "Monthly Reports", "Secure Document Vault", "Community Support"].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href="/login"
                                    className="w-full py-4 text-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition-all"
                                >
                                    Start For Free
                                </Link>
                            </div>

                            {/* Pro Plan */}
                            <div className="relative glass-effect p-10 rounded-3xl border border-accent-purple/50 flex flex-col h-full bg-slate-900/60 shadow-2xl shadow-accent-purple/10">
                                <div className="absolute top-0 right-10 -translate-y-1/2 bg-gradient-to-r from-accent-purple to-accent-blue py-1 px-4 rounded-full text-[10px] font-black uppercase tracking-widest text-white">
                                    Most Popular
                                </div>
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                                    <p className="text-slate-400 text-sm">Tailored for growing businesses.</p>
                                </div>
                                <div className="mb-8 flex items-baseline gap-1">
                                    <span className="text-5xl font-black text-white text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Custom</span>
                                    <span className="text-slate-500">/yr</span>
                                </div>
                                <ul className="space-y-4 mb-10 flex-1">
                                    {["Advanced Analytics", "Quarterly Tax Strategy", "Multi-user Access", "Dedicated Support", "API Integration"].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-slate-200 text-sm">
                                            <CheckCircle2 className="w-5 h-5 text-accent-purple font-bold" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href="/pricing"
                                    className="w-full py-4 text-center bg-gradient-to-r from-accent-purple to-accent-blue rounded-xl font-bold shadow-xl shadow-accent-purple/20 hover:scale-[1.02] transition-all"
                                >
                                    Go Pro
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 px-8">
                    <div className="max-w-5xl mx-auto relative rounded-3xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent-purple to-accent-blue -z-10 animate-pulse duration-[10s]"></div>
                        <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-md"></div>
                        <div className="relative py-20 px-10 text-center space-y-8">
                            <h2 className="text-4xl md:text-5xl font-black text-white">Ready to automate your taxes?</h2>
                            <p className="text-white/80 max-w-xl mx-auto text-lg leading-relaxed">
                                Join thousands of businesses that trust TaxDash for their financial oversight and regulatory compliance.
                            </p>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 px-10 py-5 bg-white text-slate-950 rounded-full font-black text-lg hover:bg-slate-100 transition-all hover:shadow-2xl hover:scale-105"
                            >
                                Join Now <ArrowRight className="w-6 h-6" />
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-20 px-8 border-t border-white/5 space-y-12">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
                    <div className="col-span-2 space-y-6">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-accent-purple to-accent-blue rounded flex items-center justify-center">
                                <Calculator className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white">TaxDash</span>
                        </Link>
                        <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
                            Financial intelligence for the modern entrepreneur. Automate, optimize, and scale with confidence.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-white font-bold text-sm">Product</h4>
                        <ul className="space-y-3 text-sm text-slate-500 font-medium">
                            <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                            <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                            <li><Link href="/analytics" className="hover:text-white transition-colors">Analytics</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-white font-bold text-sm">Company</h4>
                        <ul className="space-y-3 text-sm text-slate-500 font-medium">
                            <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-slate-600 text-[10px] uppercase tracking-widest font-bold">
                        © 2026 TAXDASH INC. ALL RIGHTS RESERVED.
                    </p>

                    <Link
                        href="https://www.vvsdigitalsolutions.com"
                        target="_blank"
                        className="text-slate-500 text-xs hover:text-slate-300 transition-colors flex items-center justify-center gap-1 group"
                    >
                        <span>Powered by</span>
                        <span className="font-bold border-b border-transparent group-hover:border-slate-300">vvsdigitalsolutions.com</span>
                    </Link>
                </div>
            </footer>
        </div>
    );
}
