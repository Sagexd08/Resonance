'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: ('EMPLOYEE' | 'MANAGER' | 'ADMIN')[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') return;

        if (!session) {
            router.push('/login');
            return;
        }

        if (allowedRoles && !allowedRoles.includes(session.user.role as any)) {
            router.push('/unauthorized');
        }
    }, [session, status, router, allowedRoles]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a]">
                <motion.div
                    className="flex flex-col items-center gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-gray-400">Loading...</p>
                </motion.div>
            </div>
        );
    }

    if (!session) return null;

    if (allowedRoles && !allowedRoles.includes(session.user.role as any)) {
        return null;
    }

    return <>{children}</>;
}
