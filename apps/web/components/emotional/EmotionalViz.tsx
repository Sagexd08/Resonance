'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../primitives/Box';
import { Text } from '../primitives/Text';
import { Stack } from '../primitives/Stack';
import { GlassSurface } from '../primitives/GlassSurface';
import { floating, pulseBreathe, itemReveal } from '../../lib/motion/transitions';
interface EnergyRingProps {
    score: number;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
    animate?: boolean;
    className?: string;
}

const energySizeMap = {
    sm: { ring: 80, stroke: 8, text: 'text-lg' },
    md: { ring: 120, stroke: 10, text: 'text-2xl' },
    lg: { ring: 160, stroke: 12, text: 'text-4xl' },
};

function getEnergyColor(score: number): string {
    if (score >= 70) return 'var(--emo-energized)';
    if (score >= 40) return 'var(--emo-neutral)';
    return 'var(--emo-drained)';
}

function getEnergyGlow(score: number): string {
    if (score >= 70) return 'var(--emo-energized-glow)';
    if (score >= 40) return 'var(--emo-neutral-glow)';
    return 'var(--emo-drained-glow)';
}

export function EnergyRing({
    score,
    size = 'md',
    showLabel = true,
    animate = true,
    className,
}: EnergyRingProps) {
    const config = energySizeMap[size];
    const radius = (config.ring - config.stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = getEnergyColor(score);
    const glow = getEnergyGlow(score);

    return (
        <div className={cn('relative inline-flex items-center justify-center', className)}>
            <motion.div
                variants={animate ? floating : undefined}
                animate={animate ? 'animate' : undefined}
            >
                <svg
                    width={config.ring}
                    height={config.ring}
                    className="transform -rotate-90"
                >
                    {}
                    <circle
                        cx={config.ring / 2}
                        cy={config.ring / 2}
                        r={radius}
                        fill="none"
                        stroke="var(--surface-5)"
                        strokeWidth={config.stroke}
                    />

                    {}
                    <motion.circle
                        cx={config.ring / 2}
                        cy={config.ring / 2}
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth={config.stroke}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }}
                        style={{
                            filter: `drop-shadow(0 0 8px ${glow})`,
                        }}
                    />
                </svg>

                {}
                {showLabel && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Text variant="h2" className={cn(config.text, 'font-black')} style={{ color }}>
                            {score}
                        </Text>
                        <Text variant="micro" className="text-text-tertiary uppercase tracking-wider">
                            Energy
                        </Text>
                    </div>
                )}
            </motion.div>
        </div>
    );
}






interface StabilityGaugeProps {
    score: number; 
    period?: '7d' | '14d' | '30d';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function StabilityGauge({
    score,
    period = '7d',
    size = 'md',
    className,
}: StabilityGaugeProps) {
    const sizeMap = {
        sm: 'w-32 h-20',
        md: 'w-48 h-28',
        lg: 'w-64 h-36',
    };

    
    const waveAmplitude = Math.max(2, 10 - (score / 10));
    const waveDuration = Math.max(2, 8 - (score / 20));

    const getStabilityLabel = () => {
        if (score >= 70) return 'Stable';
        if (score >= 40) return 'Fluctuating';
        return 'Turbulent';
    };

    const getStabilityColor = () => {
        if (score >= 70) return 'emo-happy';
        if (score >= 40) return 'emo-neutral';
        return 'emo-drained';
    };

    const stabilityTextClass = {
        'emo-happy': 'text-emo-happy',
        'emo-neutral': 'text-emo-neutral',
        'emo-drained': 'text-emo-drained',
    }[getStabilityColor()];

    return (
        <GlassSurface intensity="light" className={cn('p-4 overflow-hidden', sizeMap[size], className)}>
            <Stack gap={2} className="h-full">
                <Stack direction="row" justify="between" align="center">
                    <Text variant="caption" className="text-text-tertiary">Stability</Text>
                    <Text variant="micro" className="text-text-tertiary">{period}</Text>
                </Stack>

                {}
                <div className="flex-1 relative overflow-hidden rounded-lg">
                    <svg
                        className="absolute inset-0 w-full h-full"
                        preserveAspectRatio="none"
                        viewBox="0 0 100 50"
                    >
                        <defs>
                            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor={`var(--${getStabilityColor()})`} stopOpacity="0.4" />
                                <stop offset="100%" stopColor={`var(--${getStabilityColor()})`} stopOpacity="0.1" />
                            </linearGradient>
                        </defs>

                        <motion.path
                            d={`M0,25 Q25,${25 - waveAmplitude} 50,25 T100,25 L100,50 L0,50 Z`}
                            fill="url(#waveGradient)"
                            animate={{
                                d: [
                                    `M0,25 Q25,${25 - waveAmplitude} 50,25 T100,25 L100,50 L0,50 Z`,
                                    `M0,25 Q25,${25 + waveAmplitude} 50,25 T100,25 L100,50 L0,50 Z`,
                                    `M0,25 Q25,${25 - waveAmplitude} 50,25 T100,25 L100,50 L0,50 Z`,
                                ],
                            }}
                            transition={{
                                duration: waveDuration,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                    </svg>
                </div>

                <Stack direction="row" justify="between" align="center">
                    <Text variant="body" className="font-semibold">{getStabilityLabel()}</Text>
                    <Text variant="micro" className={stabilityTextClass}>{score}%</Text>
                </Stack>
            </Stack>
        </GlassSurface>
    );
}






interface EmotionalStreakProps {
    currentStreak: number;
    longestStreak: number;
    className?: string;
}

export function EmotionalStreak({
    currentStreak,
    longestStreak,
    className,
}: EmotionalStreakProps) {
    const streakLevel = Math.min(5, Math.floor(currentStreak / 7) + 1);
    const flames = Array.from({ length: streakLevel }, (_, i) => i);

    return (
        <GlassSurface intensity="medium" className={cn('p-6', className)}>
            <Stack gap={4}>
                <Stack direction="row" justify="between" align="center">
                    <Text variant="h4">Resonance Streak</Text>
                    <Stack direction="row" gap={1}>
                        {flames.map((i) => (
                            <motion.span
                                key={i}
                                animate={{
                                    y: [0, -3, 0],
                                    opacity: [0.7, 1, 0.7],
                                }}
                                transition={{
                                    duration: 0.8,
                                    delay: i * 0.1,
                                    repeat: Infinity,
                                }}
                                className="text-xl"
                            >
                                🔥
                            </motion.span>
                        ))}
                    </Stack>
                </Stack>

                <Stack direction="row" gap={8}>
                    <div>
                        <Text variant="display" gradient="energized" className="text-5xl font-black">
                            {currentStreak}
                        </Text>
                        <Text variant="micro" className="text-text-tertiary">Current Days</Text>
                    </div>
                    <div className="border-l border-surface-5 pl-8">
                        <Text variant="h2" className="text-text-secondary">
                            {longestStreak}
                        </Text>
                        <Text variant="micro" className="text-text-tertiary">Best Streak</Text>
                    </div>
                </Stack>

                {currentStreak >= 7 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-xl bg-emo-happy-muted border border-emo-happy/20"
                    >
                        <Text variant="body-sm" className="text-emo-happy">
                            🎉 You've been consistent for a week! Keep the momentum.
                        </Text>
                    </motion.div>
                )}
            </Stack>
        </GlassSurface>
    );
}

// ============================================================================
// SENTIMENT WAVE COMPONENT
// Audio-waveform-style sentiment visualization
// ============================================================================

interface SentimentPoint {
    timestamp: string;
    sentiment: number; // -1 to 1
    intensity: number; // 0 to 1
}

interface SentimentWaveProps {
    data: SentimentPoint[];
    height?: number;
    interactive?: boolean;
    className?: string;
}

export function SentimentWave({
    data,
    height = 80,
    interactive = false,
    className,
}: SentimentWaveProps) {
    if (!data.length) return null;

    const barWidth = 4;
    const barGap = 2;
    const width = data.length * (barWidth + barGap);

    return (
        <div className={cn('overflow-x-auto', className)}>
            <svg width={width} height={height} className="block">
                {data.map((point, i) => {
                    const barHeight = Math.abs(point.sentiment) * point.intensity * (height / 2);
                    const y = point.sentiment >= 0 ? height / 2 - barHeight : height / 2;
                    const color = point.sentiment >= 0 ? 'var(--emo-happy)' : 'var(--emo-drained)';

                    return (
                        <motion.rect
                            key={i}
                            x={i * (barWidth + barGap)}
                            y={y}
                            width={barWidth}
                            height={Math.max(2, barHeight)}
                            rx={2}
                            fill={color}
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ delay: i * 0.02, duration: 0.3 }}
                            style={{ originY: point.sentiment >= 0 ? '100%' : '0%' }}
                            className={cn(
                                interactive && 'cursor-pointer hover:opacity-80 transition-opacity'
                            )}
                        />
                    );
                })}

                {/* Center Line */}
                <line
                    x1={0}
                    y1={height / 2}
                    x2={width}
                    y2={height / 2}
                    stroke="var(--surface-5)"
                    strokeWidth={1}
                />
            </svg>
        </div>
    );
}

// ============================================================================
// RISK INDICATOR COMPONENT
// Soft, non-alarming risk level indicator
// ============================================================================

interface RiskIndicatorProps {
    level: 'stable' | 'elevated' | 'concerning';
    affectedPercentage?: number;
    trend?: 'improving' | 'stable' | 'worsening';
    className?: string;
}

export function RiskIndicator({
    level,
    affectedPercentage,
    trend,
    className,
}: RiskIndicatorProps) {
    const config = {
        stable: {
            color: 'emo-happy',
            label: 'Stable',
            message: 'Team wellness is in a healthy range.',
            animate: false,
        },
        elevated: {
            color: 'emo-energized',
            label: 'Elevated',
            message: 'Some team members may benefit from support.',
            animate: true,
        },
        concerning: {
            color: 'emo-burnout',
            label: 'Needs Attention',
            message: 'Consider initiating wellness check-ins.',
            animate: true,
        },
    }[level];

    const trendIcon = {
        improving: '↗️',
        stable: '→',
        worsening: '↘️',
    };

    const dotBgClass = {
        'emo-happy': 'bg-emo-happy',
        'emo-energized': 'bg-emo-energized',
        'emo-burnout': 'bg-emo-burnout',
    }[config.color];

    const textColorClass = {
        'emo-happy': 'text-emo-happy',
        'emo-energized': 'text-emo-energized',
        'emo-burnout': 'text-emo-burnout',
    }[config.color];

    const glowShadowClass = {
        'emo-happy': 'shadow-[0_0_12px_var(--emo-happy-glow)]',
        'emo-energized': 'shadow-[0_0_12px_var(--emo-energized-glow)]',
        'emo-burnout': 'shadow-[0_0_12px_var(--emo-burnout-glow)]',
    }[config.color];

    return (
        <GlassSurface intensity="light" className={cn('p-4', className)}>
            <Stack direction="row" gap={4} align="center">
                <motion.div
                    animate={config.animate ? {
                        scale: [1, 1.02, 1],
                        opacity: [0.8, 1, 0.8],
                    } : {}}
                    transition={config.animate ? {
                        duration: 4,
                        ease: [0.4, 0, 0.6, 1],
                        repeat: Infinity,
                    } : undefined}
                    className={cn(
                        'w-4 h-4 rounded-full',
                        dotBgClass,
                        config.animate && glowShadowClass
                    )}
                />

                <Stack gap={1} className="flex-1">
                    <Stack direction="row" align="center" gap={2}>
                        <Text variant="body" className="font-semibold">{config.label}</Text>
                        {trend && (
                            <Text variant="micro" className="text-text-tertiary">
                                {trendIcon[trend]}
                            </Text>
                        )}
                    </Stack>
                    <Text variant="micro" className="text-text-tertiary">
                        {config.message}
                    </Text>
                </Stack>

                {affectedPercentage !== undefined && (
                    <div className="text-right">
                        <Text variant="h4" className={textColorClass}>
                            {affectedPercentage}%
                        </Text>
                        <Text variant="micro" className="text-text-tertiary">
                            affected
                        </Text>
                    </div>
                )}
            </Stack>
        </GlassSurface>
    );
}

// ============================================================================
// AI REFLECTION CARD COMPONENT
// AI-generated insight with supportive tone
// ============================================================================

interface AIReflectionCardProps {
    type: 'reflection' | 'pattern' | 'suggestion' | 'celebration';
    title: string;
    body: string;
    confidence?: number;
    onDismiss?: () => void;
    onAction?: { label: string; onClick: () => void };
    className?: string;
}

export function AIReflectionCard({
    type,
    title,
    body,
    confidence,
    onDismiss,
    onAction,
    className,
}: AIReflectionCardProps) {
    const typeConfig = {
        reflection: { icon: '💭', border: 'border-accent-primary/20' },
        pattern: { icon: '🔄', border: 'border-accent-secondary/20' },
        suggestion: { icon: '💡', border: 'border-emo-energized/20' },
        celebration: { icon: '🎉', border: 'border-emo-happy/20' },
    }[type];

    return (
        <motion.div
            variants={itemReveal}
            initial="initial"
            animate="animate"
            className={className}
        >
            <GlassSurface
                intensity="light"
                className={cn('p-6 border-l-4', typeConfig.border)}
            >
                <Stack gap={4}>
                    <Stack direction="row" justify="between" align="start">
                        <Stack direction="row" gap={3} align="center">
                            <span className="text-2xl">{typeConfig.icon}</span>
                            <Text variant="h4">{title}</Text>
                        </Stack>
                        {onDismiss && (
                            <button
                                onClick={onDismiss}
                                className="text-text-tertiary hover:text-text-primary transition-colors text-sm"
                            >
                                Dismiss
                            </button>
                        )}
                    </Stack>

                    <Text variant="body" className="text-text-secondary leading-relaxed">
                        {body}
                    </Text>

                    {(confidence !== undefined || onAction) && (
                        <Stack direction="row" justify="between" align="center">
                            {confidence !== undefined && (
                                <Text variant="micro" className="text-text-tertiary">
                                    Confidence: {Math.round(confidence * 100)}%
                                </Text>
                            )}
                            {onAction && (
                                <button
                                    onClick={onAction.onClick}
                                    className="px-4 py-2 rounded-lg bg-accent-primary/10 text-accent-primary text-sm font-medium hover:bg-accent-primary/20 transition-colors"
                                >
                                    {onAction.label}
                                </button>
                            )}
                        </Stack>
                    )}
                </Stack>
            </GlassSurface>
        </motion.div>
    );
}

// ============================================================================
// EMOTION PILL COMPONENT
// Compact emotion state indicator
// ============================================================================

interface EmotionPillProps {
    mood: 'Energized' | 'Happy' | 'Neutral' | 'Drained';
    size?: 'sm' | 'md';
    showIcon?: boolean;
    className?: string;
}

const moodEmojis = {
    Energized: '⚡',
    Happy: '😊',
    Neutral: '😌',
    Drained: '😔',
};

export function EmotionPill({ mood, size = 'sm', showIcon = true, className }: EmotionPillProps) {
    const sizeClasses = size === 'sm' ? 'px-3 py-1 text-micro' : 'px-4 py-1.5 text-caption';

    const moodClassName = {
        Energized: 'bg-emo-energized-muted text-emo-energized border border-emo-energized/20',
        Happy: 'bg-emo-happy-muted text-emo-happy border border-emo-happy/20',
        Neutral: 'bg-emo-neutral-muted text-emo-neutral border border-emo-neutral/20',
        Drained: 'bg-emo-drained-muted text-emo-drained border border-emo-drained/20',
    }[mood];

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full font-medium',
                moodClassName,
                sizeClasses,
                className
            )}
        >
            {showIcon && <span>{moodEmojis[mood]}</span>}
            <span>{mood}</span>
        </span>
    );
}
