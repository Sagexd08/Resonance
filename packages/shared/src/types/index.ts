
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
    moodScore: number; 
    energyScore: number; 
    stressScore: number; 
    note?: string;
    timestamp: Date;
}

export interface TeamMetrics {
    orgId: string;
    avgMood: number;
    burnoutIndex: number;
    engagementIndex: number;
    period: string; 
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
