'use client';

import { ReactNode } from 'react';
import { Home, LineChart, PlusCircle, Settings, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function AppLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen bg-[#0a0a1a] text-white overflow-hidden">
            {/* Sidebar / Dock Area */}
            <aside className="w-20 lg:w-64 border-r border-white/5 flex flex-col items-center lg:items-start py-8 bg-[#0a0a1a]">
                <div className="mb-10 px-4">
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 hidden lg:block">Resonance</span>
                    <span className="text-2xl font-bold text-blue-500 lg:hidden">R</span>
                </div>

                <nav className="flex-1 w-full px-2 space-y-2">
                    <NavItem href="/dashboard" icon={<Home size={20} />} label="Dashboard" />
                    <NavItem href="/check-in" icon={<PlusCircle size={20} />} label="Check-in" />
                    <NavItem href="/analytics" icon={<LineChart size={20} />} label="Analytics" />
                    <NavItem href="/settings" icon={<Settings size={20} />} label="Settings" />
                </nav>

                <div className="p-4 w-full">
                    <button
                        onClick={() => signOut()}
                        className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="hidden lg:block">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto relative">
                {/* Top Header can go here if needed */}
                <div className="max-w-7xl mx-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

function NavItem({ href, icon, label }: { href: string, icon: ReactNode, label: string }) {
    return (
        <a href={href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all group">
            <span className="group-hover:text-blue-400 transition-colors">{icon}</span>
            <span className="hidden lg:block font-medium">{label}</span>
        </a>
    )
}
