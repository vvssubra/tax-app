import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
    title: "Tax Dashboard - Expense Management",
    description: "Efficiently manage your tax expenses and income.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable} font-sans bg-slate-950 text-white min-h-screen antialiased`}>
                {/* Background gradients */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl"></div>
                </div>
                {children}
            </body>
        </html>
    );
}
