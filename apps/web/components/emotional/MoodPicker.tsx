"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassSurface } from "../primitives/GlassSurface";
import { Text } from "../primitives/Text";
import { Stack } from "../primitives/Stack";
import { cn } from "../primitives/Box";
import { Activity, Battery, Minus, Zap } from "lucide-react";

export type MoodType = "Energized" | "Happy" | "Neutral" | "Drained";

interface MoodOption {
    value: MoodType;
    label: string;
    icon: any;
    color: string;
    gradient: string;
    glow: string;
}

const moods: MoodOption[] = [
    {
        value: "Energized",
        label: "Energized",
        icon: Zap,
        color: "var(--emo-energized-base)",
        gradient: "var(--emo-energized-grad)",
        glow: "var(--emo-energized-glow)"
    },
    {
        value: "Happy",
        label: "Happy",
        icon: Activity,
        color: "var(--emo-happy-base)",
        gradient: "var(--emo-happy-grad)",
        glow: "var(--emo-happy-glow)"
    },
    {
        value: "Neutral",
        label: "Neutral",
        icon: Minus,
        color: "var(--emo-neutral-base)",
        gradient: "var(--emo-neutral-grad)",
        glow: "var(--emo-neutral-glow)"
    },
    {
        value: "Drained",
        label: "Drained",
        icon: Battery,
        color: "var(--emo-drained-base)",
        gradient: "var(--emo-drained-grad)",
        glow: "var(--emo-drained-glow)"
    },
];

interface MoodPickerProps {
    onSelect?: (mood: MoodType) => void;
    selected?: MoodType | null;
}

export function MoodPicker({ onSelect, selected: controlledSelected }: MoodPickerProps) {
    const [internalSelected, setInternalSelected] = useState<MoodType | null>(null);
    const selected = controlledSelected !== undefined ? controlledSelected : internalSelected;

    const handleSelect = (mood: MoodType) => {
        setInternalSelected(mood);
        onSelect?.(mood);

        
        if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate(10);
        }
    };

    return (
        <GlassSurface intensity="medium" className="p-sm w-full max-w-2xl mx-auto">
            <Stack gap={6} align="center">
                <Text variant="h3" className="text-center">How are you feeling right now?</Text>

                <div className="flex w-full justify-between items-end gap-2 px-2 h-32 relative">
                    {}
                    <div className="absolute bottom-8 left-4 right-4 h-1 bg-surface-5 rounded-full -z-10" />

                    {moods.map((mood) => {
                        const isSelected = selected === mood.value;
                        const Icon = mood.icon;

                        return (
                            <div
                                key={mood.value}
                                className="relative group flex flex-col items-center gap-4 cursor-pointer"
                                onClick={() => handleSelect(mood.value)}
                            >
                                {}

                                {}
                                <motion.div
                                    animate={{
                                        scale: isSelected ? 1.2 : 1,
                                        y: isSelected ? -10 : 0,
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className={cn(
                                        "w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative bg-bg-primary",
                                        isSelected
                                            ? "border-transparent"
                                            : "border-surface-5 hover:border-surface-4 bg-surface-2"
                                    )}
                                    style={{
                                        background: isSelected ? mood.gradient : undefined,
                                        boxShadow: isSelected ? `0 0 30px ${mood.glow}` : undefined,
                                    }}
                                >
                                    <Icon
                                        className={cn(
                                            "w-8 h-8 transition-colors duration-300",
                                            isSelected ? "text-white" : "text-text-tertiary group-hover:text-text-secondary"
                                        )}
                                    />

                                    {}
                                    {isSelected && (
                                        <motion.div
                                            layoutId="ripple"
                                            className="absolute inset-0 rounded-full"
                                            initial={{ scale: 1, opacity: 0.5 }}
                                            animate={{ scale: 1.5, opacity: 0 }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                            style={{ border: `2px solid ${mood.color}` }}
                                        />
                                    )}
                                </motion.div>

                                {}
                                <Text
                                    variant={isSelected ? "body" : "body-sm"}
                                    className={cn(
                                        "transition-all duration-300 absolute -bottom-8 w-24 text-center",
                                        isSelected
                                            ? "text-text-primary font-medium scale-110"
                                            : "text-text-tertiary group-hover:text-text-secondary"
                                    )}
                                >
                                    {mood.label}
                                </Text>
                            </div>
                        );
                    })}
                </div>

                {}
                <div className="h-12 flex items-center justify-center w-full mt-4">
                    <AnimatePresence mode="wait">
                        {selected && (
                            <motion.div
                                key={selected}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <Text variant="body-lg" className="text-center text-text-secondary">
                                    You're feeling <span style={{ color: moods.find(m => m.value === selected)?.color }} className="font-semibold">{moods.find(m => m.value === selected)?.label}</span>.
                                    {selected === "Energized" && " Ready to crush it! 🚀"}
                                    {selected === "Happy" && " Great vibes! ✨"}
                                    {selected === "Neutral" && " Steady state. 🌊"}
                                    {selected === "Drained" && " Take it easy today. 🛌"}
                                </Text>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </Stack>
        </GlassSurface>
    );
}
