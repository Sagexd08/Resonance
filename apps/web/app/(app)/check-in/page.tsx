'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Smile, Meh, Frown, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const MOODS = [
    { label: 'Energized', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-400/20', border: 'border-amber-400/50' },
    { label: 'Happy', icon: Smile, color: 'text-emerald-400', bg: 'bg-emerald-400/20', border: 'border-emerald-400/50' },
    { label: 'Neutral', icon: Meh, color: 'text-blue-400', bg: 'bg-blue-400/20', border: 'border-blue-400/50' },
    { label: 'Drained', icon: Frown, color: 'text-rose-400', bg: 'bg-rose-400/20', border: 'border-rose-400/50' },
];

export default function CheckInPage() {
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [note, setNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const router = useRouter();

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

            // Redirect after delay
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } catch (error) {
            console.error('Check-in error:', error);
            alert('Failed to save check-in. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isComplete) {
        return (
            <div className="flex flex-col items-center justify-center p-12 min-h-[60vh] text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6"
                >
                    <CheckCircle className="w-12 h-12 text-green-400" />
                </motion.div>
                <h2 className="text-3xl font-bold mb-4">Checked In!</h2>
                <p className="text-gray-400">Your vibes have been recorded. See you on the dashboard.</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-12">
            <header className="mb-12">
                <h1 className="text-4xl font-bold mb-4">Daily Check-in</h1>
                <p className="text-gray-400 text-lg">Take a moment to reflect. How are you feeling right now?</p>
            </header>

            <div className="space-y-8">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-4 uppercase tracking-wider">Select your mood</label>
                    <div className="grid grid-cols-2 gap-4">
                        {MOODS.map((mood) => {
                            const Icon = mood.icon;
                            const isSelected = selectedMood === mood.label;
                            return (
                                <button
                                    key={mood.label}
                                    onClick={() => setSelectedMood(mood.label)}
                                    className={`
                                        relative p-6 rounded-2xl border transition-all duration-200 flex flex-col items-center gap-3 overflow-hidden
                                        ${isSelected ? `${mood.border} bg-white/10` : 'border-white/5 bg-white/5 hover:bg-white/10'}
                                    `}
                                >
                                    <Icon className={`w-8 h-8 ${mood.color}`} />
                                    <span className="font-medium">{mood.label}</span>
                                    {isSelected && <div className={`absolute inset-0 opacity-20 ${mood.bg}`} />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-4 uppercase tracking-wider">Anything on your mind? (Optional)</label>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="I'm feeling..."
                        className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                    />
                </div>

                <div className="pt-4">
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedMood || isSubmitting}
                        className={`
                            w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300
                            ${!selectedMood
                                ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                                : 'bg-white text-black hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/10'}
                        `}
                    >
                        {isSubmitting ? 'Recording...' : 'Complete Check-in'}
                    </button>
                </div>
            </div>
        </div>
    );
}
