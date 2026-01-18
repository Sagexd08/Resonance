import { ReactNode } from 'react';
import { cn } from './Box';
export type Elevation = 0 | 1 | 2 | 3;
export type RadiusToken = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

const elevationMap: Record<Elevation, string> = {
    0: 'bg-bg-primary',
    1: 'bg-bg-secondary',
    2: 'bg-bg-tertiary',
    3: 'bg-surface-3',
};

const radiusMap: Record<RadiusToken, string> = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
};

interface SurfaceProps {
    as?: 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer';
    elevation?: Elevation;
    radius?: RadiusToken;
    border?: boolean;
    interactive?: boolean;
    className?: string;
    onClick?: () => void;
    children: ReactNode;
}

export function Surface({
    as: Component = 'div',
    elevation = 1,
    radius = 'xl',
    border = false,
    interactive = false,
    className,
    onClick,
    children,
}: SurfaceProps) {
    return (
        <Component
            className={cn(
                elevationMap[elevation],
                radiusMap[radius],
                border && 'border border-surface-5',
                interactive && 'cursor-pointer transition-all duration-fast hover:scale-[1.01] active:scale-[0.99]',
                className
            )}
            onClick={onClick}
        >
            {children}
        </Component>
    );
}






type SpacerSize = 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;

const spacerMap: Record<SpacerSize, string> = {
    1: 'h-1',
    2: 'h-2',
    3: 'h-3',
    4: 'h-4',
    5: 'h-6',
    6: 'h-8',
    8: 'h-12',
    10: 'h-16',
    12: 'h-24',
    16: 'h-32',
};

interface SpacerProps {
    size?: SpacerSize;
    axis?: 'vertical' | 'horizontal';
}

export function Spacer({ size = 4, axis = 'vertical' }: SpacerProps) {
    const isHorizontal = axis === 'horizontal';
    const sizeClass = isHorizontal
        ? spacerMap[size].replace('h-', 'w-')
        : spacerMap[size];

    return <div className={cn(sizeClass, isHorizontal ? 'inline-block' : 'block')} aria-hidden="true" />;
}






interface DividerProps {
    orientation?: 'horizontal' | 'vertical';
    label?: string;
    className?: string;
}

export function Divider({ orientation = 'horizontal', label, className }: DividerProps) {
    if (orientation === 'vertical') {
        return (
            <div
                className={cn('w-px bg-surface-5 self-stretch', className)}
                role="separator"
                aria-orientation="vertical"
            />
        );
    }

    if (label) {
        return (
            <div className={cn('flex items-center gap-4', className)} role="separator">
                <div className="flex-1 h-px bg-surface-5" />
                <span className="text-text-tertiary text-caption font-medium">{label}</span>
                <div className="flex-1 h-px bg-surface-5" />
            </div>
        );
    }

    return (
        <div
            className={cn('h-px bg-surface-5 w-full', className)}
            role="separator"
            aria-orientation="horizontal"
        />
    );
}






interface FocusRingProps {
    color?: 'accent' | 'emotional';
    offset?: number;
    children: ReactNode;
    className?: string;
}

export function FocusRing({
    color = 'accent',
    offset = 2,
    children,
    className,
}: FocusRingProps) {
    const colorClass = color === 'accent'
        ? 'focus-visible:ring-accent-primary/60'
        : 'focus-visible:ring-emo-happy/60';

    return (
        <div
            className={cn(
                'focus-visible:outline-none focus-visible:ring-2',
                colorClass,
                `focus-visible:ring-offset-${offset}`,
                'focus-visible:ring-offset-bg-primary',
                'rounded-xl transition-shadow',
                className
            )}
            tabIndex={-1}
        >
            {children}
        </div>
    );
}






interface GlowLayerProps {
    color: string; 
    intensity?: 'soft' | 'medium' | 'strong';
    animate?: boolean;
    className?: string;
    children: ReactNode;
}

const intensityMap = {
    soft: '0.3',
    medium: '0.5',
    strong: '0.7',
};

export function GlowLayer({
    color,
    intensity = 'medium',
    animate = false,
    className,
    children,
}: GlowLayerProps) {
    return (
        <div className={cn('relative', className)}>
            {}
            <div
                className={cn(
                    'absolute inset-[-20%] rounded-full blur-[40px] -z-10 pointer-events-none',
                    animate && 'animate-pulse-slow'
                )}
                style={{
                    background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                    opacity: intensityMap[intensity],
                }}
                aria-hidden="true"
            />
            {children}
        </div>
    );
}






type GapToken = 1 | 2 | 3 | 4 | 5 | 6;

const gapMap: Record<GapToken, string> = {
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-6',
    6: 'gap-8',
};

interface ClusterProps {
    gap?: GapToken;
    align?: 'start' | 'center' | 'end';
    justify?: 'start' | 'center' | 'end' | 'between';
    className?: string;
    children: ReactNode;
}

export function Cluster({
    gap = 2,
    align = 'center',
    justify = 'start',
    className,
    children,
}: ClusterProps) {
    const alignMap = {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
    };

    const justifyMap = {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
    };

    return (
        <div
            className={cn(
                'flex flex-wrap',
                gapMap[gap],
                alignMap[align],
                justifyMap[justify],
                className
            )}
        >
            {children}
        </div>
    );
}






type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 12;

const columnsMap: Record<GridColumns, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    12: 'grid-cols-12',
};

interface GridProps {
    columns?: GridColumns;
    gap?: GapToken;
    className?: string;
    children: ReactNode;
}

export function Grid({
    columns = 3,
    gap = 4,
    className,
    children,
}: GridProps) {
    return (
        <div
            className={cn(
                'grid',
                columnsMap[columns],
                gapMap[gap],
                className
            )}
        >
            {children}
        </div>
    );
}






type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const iconSizeMap: Record<IconSize, string> = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
};

interface IconProps {
    icon: ReactNode;
    size?: IconSize;
    color?: 'primary' | 'secondary' | 'tertiary' | 'accent' | 'emotional';
    className?: string;
}

export function Icon({
    icon,
    size = 'md',
    color = 'primary',
    className,
}: IconProps) {
    const colorMap = {
        primary: 'text-text-primary',
        secondary: 'text-text-secondary',
        tertiary: 'text-text-tertiary',
        accent: 'text-accent-primary',
        emotional: 'text-emo-happy',
    };

    return (
        <span
            className={cn(
                iconSizeMap[size],
                colorMap[color],
                'inline-flex items-center justify-center',
                className
            )}
            aria-hidden="true"
        >
            {icon}
        </span>
    );
}
