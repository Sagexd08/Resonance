import { Variants } from "framer-motion";

/**
 * Resonance Motion System
 * Implementation of docs/DESIGN_SYSTEM_SPEC.md 
 */

export const easeCalm: [number, number, number, number] = [0.4, 0, 0.2, 1];
export const easeBreathe: [number, number, number, number] = [0.4, 0, 0.6, 1];


export const transitionMedium = {
    duration: 0.3,
    ease: easeCalm,
};

export const transitionSlow = {
    duration: 0.6,
    ease: easeCalm,
};


export const fadeIn: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

export const fadeSlideUp: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

export const containerReveal: Variants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        }
    },
};

export const itemReveal: Variants = {
    initial: { opacity: 0, scale: 0.95, y: 10 },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    },
};

export const pulseBreathe: Variants = {
    animate: {
        scale: [1, 1.02, 1],
        opacity: [0.8, 1, 0.8],
        transition: {
            duration: 4,
            ease: easeBreathe,
            repeat: Infinity,
        }
    }
};

export const floating: Variants = {
    animate: {
        y: [-4, 4, -4],
        transition: {
            duration: 6,
            ease: "easeInOut",
            repeat: Infinity,
        }
    }
};


export const scaleOnHover: Variants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.98 },
};

export const scaleOnTap: Variants = {
    initial: { scale: 1 },
    tap: { scale: 0.95 },
};


export const slideInFromLeft: Variants = {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 },
};

export const slideInFromRight: Variants = {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 20, opacity: 0 },
};

export const slideInFromBottom: Variants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
};


export const staggerContainer: Variants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1,
        }
    },
};

export const staggerItem: Variants = {
    initial: { opacity: 0, y: 10 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3 }
    },
};


export const glowPulse: Variants = {
    animate: {
        boxShadow: [
            '0 0 20px var(--glow-color, rgba(138, 92, 246, 0.3))',
            '0 0 40px var(--glow-color, rgba(138, 92, 246, 0.5))',
            '0 0 20px var(--glow-color, rgba(138, 92, 246, 0.3))',
        ],
        transition: {
            duration: 2,
            ease: 'easeInOut',
            repeat: Infinity,
        }
    }
};


export const drawPath = {
    initial: { pathLength: 0, opacity: 0 },
    animate: {
        pathLength: 1,
        opacity: 1,
        transition: { duration: 1.5, ease: easeCalm }
    },
};


export const reducedMotion: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};


export const prefersReducedMotion = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};


export const getMotionVariants = (fullMotion: Variants): Variants => {
    if (prefersReducedMotion()) {
        return reducedMotion;
    }
    return fullMotion;
};
