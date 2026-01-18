"use client";

import { motion } from "framer-motion";
import { GlassSurface } from "../primitives/GlassSurface";
import { Stack } from "../primitives/Stack";
import { Text } from "../primitives/Text";
import { cn } from "../primitives/Box";
import { AlertTriangle, CheckCircle, Flame } from "lucide-react";

interface BurnoutMeterProps {
    score: number; 
    trend?: "rising" | "falling" | "stable";
    className?: string;
}

export function BurnoutMeter({ score, trend = "stable", className }: BurnoutMeterProps) {
    
    const riskLevel =
        score < 30 ? "low" :
            score < 70 ? "moderate" :
                "high";

    
    const config = {
        low: {
            color: "var(--emo-stability-base)",
            gradient: "var(--emo-stability-grad)",
            glow: "var(--emo-stability-glow)",
            label: "Optimal State",
            icon: CheckCircle,
            description: "You're in the flow zone."
        },
        moderate: {
            color: "var(--emo-energized-base)",
            gradient: "var(--emo-energized-grad)",
            glow: "var(--emo-energized-glow)",
            label: "Caution",
            icon: AlertTriangle,
            description: "Monitor your energy levels."
        },
        high: {
            color: "var(--emo-burnout-base)",
            gradient: "var(--emo-burnout-grad)",
            glow: "var(--emo-burnout-glow)",
            label: "Burnout Risk",
            icon: Flame,
            description: "Take a break immediately."
        }
    }[riskLevel];

    
    const radius = 60;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <GlassSurface intensity="medium" className={cn("p-6", className)}>
            <Stack direction="row" gap={6} align="center">
                {}
                <div className="relative w-32 h-32 flex-shrink-0">
                    <svg
                        height={radius * 2}
                        width={radius * 2}
                        className="rotate-[-90deg] drop-shadow-lg"
                        style={{ filter: `drop-shadow(0 0 10px ${config.glow})` }}
                    >
                        {}
                        <circle
                            stroke="var(--surface-5)"
                            strokeWidth={stroke}
                            fill="transparent"
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                        />
                        {}
                        <motion.circle
                            stroke="url(#meterGradient)"
                            strokeWidth={stroke}
                            strokeDasharray={circumference + ' ' + circumference}
                            strokeLinecap="round"
                            fill="transparent"
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                        {}
                        <defs>
                            <linearGradient id="meterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor={riskLevel === 'high' ? '#F87171' : riskLevel === 'moderate' ? '#FCD34D' : '#38BDF8'} />
                                <stop offset="100%" stopColor={config.color} />
                            </linearGradient>
                        </defs>
                    </svg>

                    {}
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <Text variant="h3" className="font-bold tabular-nums leading-none">
                            {Math.round(score)}%
                        </Text>
                    </div>
                </div>

                {}
                <Stack gap={1}>
                    <Text variant="caption" className="uppercase tracking-wider">Current Status</Text>
                    <Stack direction="row" align="center" gap={2}>
                        <config.icon className="w-5 h-5" style={{ color: config.color }} />
                        <Text
                            variant="h4"
                            style={{ color: config.color }}
                            className="font-bold"
                        >
                            {config.label}
                        </Text>
                    </Stack>
                    <Text variant="body-sm" className="max-w-[180px]">
                        {config.description}
                    </Text>
                </Stack>
            </Stack>
        </GlassSurface>
    );
}
