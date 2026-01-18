'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Brain, Home, PlusCircle, LineChart, Settings, Users, HelpCircle } from 'lucide-react';
import { cn } from '../primitives/Box';
import { Text } from '../primitives/Text';
interface DockItem {
    id: string;
    icon: ReactNode;
    label: string;
    href: string;
    badge?: number;
}

interface FloatingDockProps {
    items?: DockItem[];
    position?: 'bottom' | 'left';
    className?: string;
}

const defaultItems: DockItem[] = [
    { id: 'home', icon: <Home className="w-5 h-5" />, label: 'Pulse', href: '/dashboard' },
    { id: 'checkin', icon: <PlusCircle className="w-5 h-5" />, label: 'Check-in', href: '/check-in' },
    { id: 'analytics', icon: <LineChart className="w-5 h-5" />, label: 'Neural', href: '/analytics' },
    { id: 'team', icon: <Users className="w-5 h-5" />, label: 'Team', href: '/team' },
    { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Settings', href: '/settings' },
];

export function FloatingDock({
    items = defaultItems,
    position = 'bottom',
    className,
}: FloatingDockProps) {
    const pathname = usePathname();

    const isBottom = position === 'bottom';

    return (
        <motion.div
            initial={{ opacity: 0, y: isBottom ? 20 : 0, x: !isBottom ? -20 : 0 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className={cn(
                'fixed z-50',
                isBottom
                    ? 'bottom-6 left-1/2 -translate-x-1/2'
                    : 'left-6 top-1/2 -translate-y-1/2',
                className
            )}
        >
            <div
                className={cn(
                    'flex gap-2 p-2 rounded-2xl',
                    'bg-surface-2/80 backdrop-blur-xl',
                    'border border-surface-5 shadow-2xl',
                    !isBottom && 'flex-col'
                )}
            >
                {items.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <Link key={item.id} href={item.href}>
                            <motion.div
                                whileHover={{ scale: 1.2, y: isBottom ? -8 : 0, x: !isBottom ? 8 : 0 }}
                                whileTap={{ scale: 0.95 }}
                                className={cn(
                                    'relative p-3 rounded-xl transition-colors duration-fast',
                                    'flex items-center justify-center',
                                    isActive
                                        ? 'bg-accent-primary text-white shadow-glow-soft'
                                        : 'text-text-tertiary hover:text-text-primary hover:bg-surface-3'
                                )}
                                style={isActive ? { '--glow-color': 'var(--accent-primary-glow)' } as any : {}}
                            >
                                {item.icon}

                                {}
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileHover={{ opacity: 1, scale: 1 }}
                                    className={cn(
                                        'absolute whitespace-nowrap px-2 py-1 rounded-lg',
                                        'bg-surface-3 text-text-primary text-micro font-medium',
                                        'pointer-events-none',
                                        isBottom ? 'bottom-full mb-2' : 'left-full ml-2'
                                    )}
                                >
                                    {item.label}
                                </motion.span>

                                {}
                                {item.badge && item.badge > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emo-burnout text-white text-[10px] font-bold flex items-center justify-center">
                                        {item.badge}
                                    </span>
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </div>
        </motion.div>
    );
}






interface TopNavProps {
    logo?: ReactNode;
    children?: ReactNode;
    sticky?: boolean;
    className?: string;
}

export function TopNav({ logo, children, sticky = true, className }: TopNavProps) {
    return (
        <header
            className={cn(
                'w-full px-6 py-4',
                'bg-bg-primary/80 backdrop-blur-xl border-b border-surface-5',
                sticky && 'sticky top-0 z-50',
                className
            )}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {}
                {logo || (
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <Text variant="h4" className="font-black tracking-tight">RESONANCE</Text>
                    </Link>
                )}

                {}
                {children}
            </div>
        </header>
    );
}






interface SectionProps {
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'full';
    className?: string;
    id?: string;
}

const sectionSizeMap = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    full: 'max-w-full',
};

export function Section({ children, size = 'lg', className, id }: SectionProps) {
    return (
        <section
            id={id}
            className={cn(
                'w-full mx-auto px-6 py-16 md:py-24',
                sectionSizeMap[size],
                className
            )}
        >
            {children}
        </section>
    );
}






interface ContainerProps {
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const containerSizeMap = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
};

export function Container({ children, size = 'lg', className }: ContainerProps) {
    return (
        <div className={cn('w-full mx-auto px-6', containerSizeMap[size], className)}>
            {children}
        </div>
    );
}






interface HeroProps {
    title: ReactNode;
    subtitle?: ReactNode;
    actions?: ReactNode;
    visual?: ReactNode;
    align?: 'left' | 'center';
    className?: string;
}

export function Hero({
    title,
    subtitle,
    actions,
    visual,
    align = 'center',
    className,
}: HeroProps) {
    return (
        <section
            className={cn(
                'relative min-h-[80vh] flex items-center py-20',
                'overflow-hidden',
                className
            )}
        >
            {}
            <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-accent-primary/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-secondary/10 rounded-full blur-[150px]" />
            </div>

            <Container size="lg">
                <div
                    className={cn(
                        'flex flex-col gap-16',
                        visual ? 'lg:flex-row lg:items-center lg:gap-20' : '',
                        align === 'center' && !visual && 'items-center text-center'
                    )}
                >
                    <div className={cn('flex-1', align === 'center' && !visual && 'max-w-3xl')}>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            {typeof title === 'string' ? (
                                <Text variant="display" className="text-5xl md:text-7xl mb-6">
                                    {title}
                                </Text>
                            ) : (
                                title
                            )}
                        </motion.div>

                        {subtitle && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                            >
                                {typeof subtitle === 'string' ? (
                                    <Text variant="body-lg" className="text-text-secondary mb-8 max-w-xl">
                                        {subtitle}
                                    </Text>
                                ) : (
                                    subtitle
                                )}
                            </motion.div>
                        )}

                        {actions && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="flex flex-wrap gap-4"
                            >
                                {actions}
                            </motion.div>
                        )}
                    </div>

                    {visual && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="flex-1"
                        >
                            {visual}
                        </motion.div>
                    )}
                </div>
            </Container>
        </section>
    );
}






interface BentoGridProps {
    children: ReactNode;
    columns?: 2 | 3 | 4;
    className?: string;
}

export function BentoGrid({ children, columns = 3, className }: BentoGridProps) {
    const colsMap = {
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-4',
    };

    return (
        <div className={cn('grid grid-cols-1 gap-4', colsMap[columns], className)}>
            {children}
        </div>
    );
}

interface BentoItemProps {
    children: ReactNode;
    colSpan?: 1 | 2;
    rowSpan?: 1 | 2;
    className?: string;
}

export function BentoItem({ children, colSpan = 1, rowSpan = 1, className }: BentoItemProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className={cn(
                'rounded-2xl bg-surface-2 border border-surface-5 p-6',
                'hover:border-accent-primary/30 transition-colors',
                colSpan === 2 && 'md:col-span-2',
                rowSpan === 2 && 'md:row-span-2',
                className
            )}
        >
            {children}
        </motion.div>
    );
}






interface FooterLink {
    label: string;
    href: string;
}

interface FooterSection {
    title: string;
    links: FooterLink[];
}

interface FooterProps {
    sections?: FooterSection[];
    copyright?: string;
    className?: string;
}

export function Footer({ sections, copyright, className }: FooterProps) {
    return (
        <footer className={cn('border-t border-surface-5 py-16', className)}>
            <Container size="lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
                                <Brain className="w-5 h-5 text-white" />
                            </div>
                            <Text variant="h4" className="font-black">RESONANCE</Text>
                        </div>
                        <Text variant="body-sm" className="text-text-tertiary max-w-xs">
                            A Living Emotional Operating System for modern teams.
                        </Text>
                    </div>

                    {}
                    {sections?.map((section) => (
                        <div key={section.title}>
                            <Text variant="caption" className="text-text-secondary uppercase tracking-wider mb-4 block">
                                {section.title}
                            </Text>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-text-tertiary hover:text-text-primary transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="pt-8 border-t border-surface-5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <Text variant="micro" className="text-text-tertiary">
                        {copyright || `© ${new Date().getFullYear()} Resonance. All rights reserved.`}
                    </Text>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="text-text-tertiary hover:text-text-primary text-sm transition-colors">
                            Privacy
                        </Link>
                        <Link href="/terms" className="text-text-tertiary hover:text-text-primary text-sm transition-colors">
                            Terms
                        </Link>
                    </div>
                </div>
            </Container>
        </footer>
    );
}
