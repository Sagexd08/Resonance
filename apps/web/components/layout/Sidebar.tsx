'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
    Home, LineChart, PlusCircle, Settings,
    LogOut, Users, Brain, Shield
} from 'lucide-react';
import { cn } from '../primitives/Box';
import { Text } from '../primitives/Text';
import { GlassSurface } from '../primitives/GlassSurface';

export function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const userRole = session?.user?.role;

    const navItems = [
        { href: '/dashboard', icon: Home, label: 'Pulse', roles: ['EMPLOYEE', 'MANAGER', 'ADMIN'] },
        { href: '/check-in', icon: PlusCircle, label: 'Check-in', roles: ['EMPLOYEE', 'MANAGER', 'ADMIN'] },
        { href: '/analytics', icon: LineChart, label: 'Neural', roles: ['EMPLOYEE', 'MANAGER', 'ADMIN'] },
        { href: '/team', icon: Users, label: 'Team', roles: ['MANAGER', 'ADMIN'] },
        { href: '/settings', icon: Settings, label: 'Settings', roles: ['EMPLOYEE', 'MANAGER', 'ADMIN'] },
    ];

    const filteredItems = navItems.filter(item =>
        !item.roles || (userRole && item.roles.includes(userRole))
    );

    return (
        <aside className="w-20 lg:w-72 h-full flex flex-col pt-12 pb-8 border-r border-surface-5 bg-bg-primary/50 backdrop-blur-xl relative z-50">
            {}
            <div className="px-8 mb-12 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center shadow-glow-soft" style={{ '--glow-color': 'var(--accent-primary)' } as any}>
                    <Brain className="text-white w-6 h-6" />
                </div>
                <Text variant="h3" className="hidden lg:block font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-text-primary to-text-tertiary">
                    RESONANCE
                </Text>
            </div>

            {}
            <nav className="flex-1 px-4 space-y-2">
                {filteredItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link key={item.href} href={item.href}>
                            <motion.div
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                className={cn(
                                    "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative group",
                                    isActive
                                        ? "bg-surface-3 text-text-primary shadow-glow-soft"
                                        : "text-text-tertiary hover:text-text-secondary hover:bg-surface-2"
                                )}
                                style={isActive ? { '--glow-color': 'var(--accent-primary-glow)' } as any : {}}
                            >
                                <Icon className={cn(
                                    "w-5 h-5 transition-colors",
                                    isActive ? "text-accent-primary" : "group-hover:text-text-primary"
                                )} />
                                <span className="hidden lg:block font-medium tracking-wide">
                                    {item.label}
                                </span>

                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute left-0 w-1 h-6 bg-accent-primary rounded-r-full"
                                    />
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {}
            <div className="px-4 space-y-4">
                {userRole === 'ADMIN' && (
                    <div className="px-4 py-3 rounded-2xl bg-accent-primary/5 border border-accent-primary/20 hidden lg:flex items-center gap-3">
                        <Shield className="w-4 h-4 text-accent-primary" />
                        <Text variant="micro" className="text-accent-primary font-bold">ADMIN MODE</Text>
                    </div>
                )}

                <button
                    onClick={() => signOut()}
                    className="flex items-center gap-4 w-full px-4 py-4 rounded-2xl hover:bg-emo-burnout/5 text-text-tertiary hover:text-emo-burnout transition-all group"
                >
                    <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    <span className="hidden lg:block font-medium tracking-wide">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
