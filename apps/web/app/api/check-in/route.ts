import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { mood, note } = await req.json();

        
        const moodScoreMap: Record<string, { mood: number; energy: number; stress: number }> = {
            'Energized': { mood: 8, energy: 9, stress: 3 },
            'Happy': { mood: 9, energy: 7, stress: 2 },
            'Neutral': { mood: 5, energy: 5, stress: 5 },
            'Drained': { mood: 3, energy: 2, stress: 8 },
        };

        const scores = moodScoreMap[mood] || { mood: 5, energy: 5, stress: 5 };

        
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        
        const entry = await prisma.emotionalEntry.create({
            data: {
                userId: user.id,
                moodScore: scores.mood,
                energyScore: scores.energy,
                stressScore: scores.stress,
                note: note || null,
            },
        });

        return NextResponse.json({
            success: true,
            entry: {
                id: entry.id,
                timestamp: entry.timestamp,
            }
        });
    } catch (error) {
        console.error('Check-in error:', error);
        return NextResponse.json({ error: 'Failed to save check-in' }, { status: 500 });
    }
}
