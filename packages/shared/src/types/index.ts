// packages/shared/src/types/index.ts
export interface User {
    id: string;
    name: string;
    email: string;
    role: 'EMPLOYEE' | 'MANAGER' | 'ADMIN';
    orgId: string;
    createdAt: Date;
}

export interface Organization {
    id: string;
    name: string;
    settings: Record<string, any>;
}

export interface EmotionalEntry {
    id: string;
    userId: string;
    moodScore: number; // 1‑5
    energyScore: number; // 0‑100
    stressScore: number; // 0‑100
    note?: string;
    timestamp: Date;
}

export interface TeamMetrics {
    orgId: string;
    avgMood: number;
    burnoutIndex: number;
    engagementIndex: number;
    period: string; // e.g. "2024-09"
}

export interface Alert {
    id: string;
    orgId: string;
    userId?: string;
    type: 'BURNOUT' | 'DISENGAGEMENT' | 'ANOMALY';
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    message: string;
    resolved: boolean;
    createdAt: Date;
}
