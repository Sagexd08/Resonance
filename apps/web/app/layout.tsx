import './globals.css';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import { SessionProvider } from '@/components/auth/SessionProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
    title: 'Resonance – Employee Wellness Platform',
    description: 'Daily emotional check-ins, team health dashboards, AI-powered recommendations.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.variable} font-sans bg-[#0a0a1a] text-white min-h-screen antialiased`}>
                <SessionProvider>
                    {children}
                </SessionProvider>
            </body>
        </html>
    );
}
