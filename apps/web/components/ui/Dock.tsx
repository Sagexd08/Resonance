'use client';

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, MotionValue, SpringOptions } from 'framer-motion';
import React, { Children, cloneElement, useEffect, useMemo, useRef, useState } from 'react';

import './Dock.css';

interface DockItemProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    mouseX: MotionValue<number>;
    spring: SpringOptions;
    distance: number;
    magnification: number;
    baseItemSize: number;
}

function DockItem({ children, className = '', onClick, mouseX, spring, distance, magnification, baseItemSize }: DockItemProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isHovered = useMotionValue(0);

    const mouseDistance = useTransform(mouseX, val => {
        const rect = ref.current?.getBoundingClientRect() ?? {
            x: 0,
            width: baseItemSize
        };
        return val - rect.x - baseItemSize / 2;
    });

    const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
    const size = useSpring(targetSize, spring);

    return (
        <motion.div
            ref={ref}
            style={{
                width: size,
                height: size
            }}
            onHoverStart={() => isHovered.set(1)}
            onHoverEnd={() => isHovered.set(0)}
            onFocus={() => isHovered.set(1)}
            onBlur={() => isHovered.set(0)}
            onClick={onClick}
            className={`dock-item ${className} relative flex items-center justify-center`}
            tabIndex={0}
            role="button"
            aria-haspopup="true"
        >
            {Children.map(children, child => {
                if (React.isValidElement(child)) {
                    return cloneElement(child, { isHovered } as any);
                }
                return child;
            })}
        </motion.div>
    );
}

interface DockLabelProps {
    children: React.ReactNode;
    className?: string;
    isHovered?: MotionValue<number>;
}

function DockLabel({ children, className = '', ...rest }: DockLabelProps) {
    const { isHovered } = rest;
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!isHovered) return;
        const unsubscribe = isHovered.on('change', latest => {
            setIsVisible(latest === 1);
        });
        return () => unsubscribe();
    }, [isHovered]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 10, x: "-50%" }}
                    animate={{ opacity: 1, y: -24, x: "-50%" }}
                    exit={{ opacity: 0, y: 10, x: "-50%" }}
                    transition={{ duration: 0.2 }}
                    className={`dock-label absolute left-1/2 -top-2 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-xs text-white whitespace-nowrap z-50 pointer-events-none ${className}`}
                    role="tooltip"
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

interface DockIconProps {
    children: React.ReactNode;
    className?: string;
    isHovered?: any;
}

function DockIcon({ children, className = '' }: DockIconProps) {
    return <div className={`dock-icon w-full h-full flex items-center justify-center ${className}`}>{children}</div>;
}

export interface DockItemData {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    className?: string;
}

interface DockProps {
    items: DockItemData[];
    className?: string;
    spring?: SpringOptions;
    magnification?: number;
    distance?: number;
    panelHeight?: number;
    dockHeight?: number;
    baseItemSize?: number;
}

export default function Dock({
    items,
    className = '',
    spring = { mass: 0.1, stiffness: 150, damping: 12 },
    magnification = 70,
    distance = 200,
    panelHeight = 68,
    dockHeight = 256,
    baseItemSize = 50
}: DockProps) {
    const mouseX = useMotionValue(Infinity);
    const isHovered = useMotionValue(0);

    const maxHeight = useMemo(
        () => Math.max(dockHeight, magnification + magnification / 2 + 4),
        [magnification, dockHeight]
    );
    const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
    const height = useSpring(heightRow, spring);

    return (
        <motion.div style={{ height }} className="dock-outer flex items-end justify-center w-full pb-4 pointer-events-none">
            <motion.div
                onMouseMove={(e: React.MouseEvent) => {
                    isHovered.set(1);
                    mouseX.set(e.pageX);
                }}
                onMouseLeave={() => {
                    isHovered.set(0);
                    mouseX.set(Infinity);
                }}
                className={`dock-panel pointer-events-auto mx-auto flex items-end gap-4 rounded-2xl bg-white/5 border border-white/10 px-4 pb-3 backdrop-blur-lg ${className}`}
                style={{ height: panelHeight }}
                role="toolbar"
                aria-label="Application dock"
            >
                {items.map((item, index) => (
                    <DockItem
                        key={index}
                        onClick={item.onClick}
                        className={item.className}
                        mouseX={mouseX}
                        spring={spring}
                        distance={distance}
                        magnification={magnification}
                        baseItemSize={baseItemSize}
                    >
                        <DockIcon>{item.icon}</DockIcon>
                        <DockLabel>{item.label}</DockLabel>
                    </DockItem>
                ))}
            </motion.div>
        </motion.div>
    );
}

