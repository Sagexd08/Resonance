'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Sparkles, Send, ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';


import { Stack } from '../../../components/primitives/Stack';
import { Text } from '../../../components/primitives/Text';
import { GlassSurface } from '../../../components/primitives/GlassSurface';
import { Button } from '../../../components/ui/Button';
import { MoodPicker, MoodType } from '../../../components/emotional/MoodPicker';
import { fadeIn, transitionMedium, itemReveal, containerReveal } from '../../../lib/motion/transitions';

function CheckInContent() {
    const searchParams = useSearchParams();
    const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
    const [note, setNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const moodParam = searchParams.get('mood');
        if (moodParam) {
            
            const normalized = (moodParam.charAt(0).toUpperCase() + moodParam.slice(1)) as MoodType;
            if (["Energized", "Happy", "Neutral", "Drained"].includes(normalized)) {
                setSelectedMood(normalized);
            }
        }
    }, [searchParams]);

    const handleSubmit = async () => {
        if (!selectedMood) return;
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/check-in', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mood: selectedMood,
                    note: note,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit check-in');
            }

            setIsComplete(true);

            
            setTimeout(() => {
                router.push('/dashboard');
            }, 2500);
        } catch (error) {
            console.error('Check-in error:', error);
            alert('Failed to save check-in. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isComplete) {
        return (
            <motion.div
                variants={containerReveal}
                initial="initial"
                animate="animate"
                className="flex flex-col items-center justify-center p-12 min-h-[60vh] text-center"
            >
                <motion.div
                    variants={itemReveal}
                    className="w-24 h-24 rounded-full bg-emo-happy-muted flex items-center justify-center mb-6 shadow-glow-medium"
                    style={{ '--glow-color': 'var(--emo-happy-glow)' } as any}
                >
                    <CheckCircle className="w-12 h-12 text-emo-happy" />
                </motion.div>
                <motion.div variants={itemReveal}>
                    <Text variant="display" gradient="happy" className="mb-4">Resonated.</Text>
                    <Text variant="body-lg" className="text-text-secondary max-w-sm">
                        Your vibes have been recorded. Recalibrating your dashboard...
                    </Text>
                </motion.div>
            </motion.div>
        );
    }

    return (
        <motion.div
            variants={containerReveal}
            initial="initial"
            animate="animate"
            className="max-w-3xl mx-auto py-12 px-6"
        >
            <Stack gap={12}>
                <motion.header variants={itemReveal}>
                    <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<ArrowLeft className="w-4 h-4" />}
                        onClick={() => router.push('/dashboard')}
                        className="mb-6"
                    >
                        Back to Pulse
                    </Button>
                    <Stack gap={2}>
                        <Text variant="h1" className="text-text-primary">Emotional Deep Dive</Text>
                        <Text variant="body-lg" className="text-text-secondary">
                            Take a moment. How is your energy flowing today?
                        </Text>
                    </Stack>
                </motion.header>

                <Stack gap={8}>
                    <motion.div variants={itemReveal}>
                        <GlassSurface intensity="medium" className="p-1">
                            <MoodPicker
                                selected={selectedMood}
                                onSelect={(mood) => setSelectedMood(mood)}
                            />
                        </GlassSurface>
                    </motion.div>

                    <motion.div variants={itemReveal}>
                        <Stack gap={4}>
                            <Stack direction="row" align="center" gap={2}>
                                <Sparkles className="w-4 h-4 text-accent-secondary" />
                                <Text variant="caption">Inner Dialogue (Optional)</Text>
                            </Stack>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="What's contributing to this state?"
                                className="w-full h-40 bg-surface-2 border border-surface-5 rounded-2xl p-6 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/30 transition-all resize-none font-body leading-relaxed"
                            />
                        </Stack>
                    </motion.div>

                    <motion.div variants={itemReveal}>
                        <Button
                            onClick={handleSubmit}
                            disabled={!selectedMood || isSubmitting}
                            variant={selectedMood ? "primary" : "secondary"}
                            size="lg"
                            className="w-full h-16 text-xl shadow-xl"
                            isLoading={isSubmitting}
                            rightIcon={!isSubmitting && <Send className="w-5 h-5" />}
                        >
                            {isSubmitting ? 'Syncing...' : 'Sync Resonance'}
                        </Button>
                    </motion.div>
                </Stack>
            </Stack>
        </motion.div>
    );
}

export default function CheckInPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-bg-primary">
                <Loader2 className="w-8 h-8 animate-spin text-accent-primary" />
            </div>
        }>
            <CheckInContent />
        </Suspense>
    );
}
