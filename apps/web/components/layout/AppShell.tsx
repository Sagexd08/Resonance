'use client';

import { Box } from "../primitives/Box";
import { Sidebar } from "./Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, transitionMedium } from "../../lib/motion/transitions";
import { usePathname } from "next/navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <Box className="min-h-screen flex flex-col md:flex-row font-body text-text-primary bg-bg-primary selection:bg-accent-primary/30 overflow-hidden">
            {}
            <Sidebar />

            {}
            <main className="flex-1 w-full relative z-0 overflow-y-auto bg-bg-primary">
                {}
                <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-primary/5 rounded-full blur-[120px] animate-pulse-slow" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-secondary/5 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        variants={fadeIn}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={transitionMedium}
                        className="w-full"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>
        </Box>
    );
}
