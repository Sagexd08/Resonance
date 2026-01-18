








export type MoodType = 'Energized' | 'Happy' | 'Neutral' | 'Drained';

export type Role = 'EMPLOYEE' | 'MANAGER' | 'ADMIN';

export type ISO8601 = string; 





export interface User {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
    role: Role;
    orgId: string;
    teamId?: string;
    settings: UserSettings;
    createdAt: ISO8601;
    updatedAt: ISO8601;
}

export interface UserSettings {
    theme: 'dark' | 'light' | 'system';
    notifications: boolean;
    emailDigest: 'daily' | 'weekly' | 'none';
    privacyLevel: 'standard' | 'enhanced';
}

export interface Organization {
    id: string;
    name: string;
    slug: string;
    settings: OrgSettings;
    subscriptionTier: 'free' | 'pro' | 'enterprise';
    createdAt: ISO8601;
}

export interface OrgSettings {
    anonymityThreshold: number; 
    allowManagerInsights: boolean;
    requireCheckInNote: boolean;
}

export interface Team {
    id: string;
    orgId: string;
    name: string;
    managerId: string;
    memberCount: number;
    createdAt: ISO8601;
}





export interface CheckIn {
    id: string;
    userId: string;
    mood: MoodType;
    moodScore: number; 
    intensity: number; 
    energyScore: number; 
    stressScore: number; 
    note?: string;
    isPrivate: boolean;
    createdAt: ISO8601;
}

export interface CheckInRequest {
    mood: MoodType;
    intensity?: number;
    energyScore?: number;
    stressScore?: number;
    note?: string;
    isPrivate?: boolean;
}

export interface CheckInResponse {
    id: string;
    createdAt: ISO8601;
    insight?: {
        type: 'reflection' | 'celebration';
        message: string;
    };
}





export interface EmotionalVector {
    id: string;
    userId: string;
    checkinId: string;
    sentimentScore: number; 
    energyScore: number; 
    stressScore: number; 
    emotions: EmotionBreakdown;
    computedAt: ISO8601;
}

export interface EmotionBreakdown {
    joy: number;
    sadness: number;
    anxiety: number;
    anger: number;
    calm: number;
}





export interface BurnoutScore {
    id: string;
    userId: string;
    score: number; 
    stressComponent: number;
    exhaustionComponent: number;
    volatilityComponent: number;
    trend: 'improving' | 'stable' | 'worsening';
    periodStart: ISO8601;
    periodEnd: ISO8601;
    computedAt: ISO8601;
}

export interface StabilityScore {
    id: string;
    userId: string;
    score: number; 
    moodVariance: number;
    energyVariance: number;
    period: '7d' | '14d' | '30d';
    computedAt: ISO8601;
}





export type InsightType = 'reflection' | 'pattern' | 'suggestion' | 'celebration';

export interface Insight {
    id: string;
    userId?: string;
    teamId?: string;
    type: InsightType;
    title: string;
    body: string;
    confidence: number; 
    icon: string;
    isRead: boolean;
    createdAt: ISO8601;
}





export interface Trend {
    period: '7d' | '14d' | '30d';
    dataPoints: TrendPoint[];
    direction: 'improving' | 'stable' | 'declining';
    summary: string;
}

export interface TrendPoint {
    date: ISO8601;
    avgMood: number;
    avgEnergy: number;
    avgStress: number;
    checkInCount: number;
}

export interface TimelineEntry {
    id: string;
    timestamp: ISO8601;
    mood: MoodType;
    intensity: number;
    note?: string;
}





export interface PulseSnapshot {
    teamId: string;
    timestamp: ISO8601;
    avgMood: number;
    avgEnergy: number;
    avgStress: number;
    participationRate: number;
    riskLevel: 'stable' | 'elevated' | 'concerning';
    memberCount: number;
    activeCount: number;
}

export interface TeamMetrics {
    teamId: string;
    period: '7d' | '14d' | '30d';
    avgMood: number;
    avgEnergy: number;
    avgStress: number;
    stabilityScore: number;
    burnoutIndex: number;
    participationRate: number;
    moodDistribution: MoodDistribution;
    trends: TrendPoint[];
}

export interface MoodDistribution {
    Energized: number;
    Happy: number;
    Neutral: number;
    Drained: number;
}

export interface TeamActivity {
    userId: string; 
    timestamp: ISO8601;
    mood: 'happy' | 'neutral' | 'drained';
}





export interface MetricsResponse {
    personal: {
        totalCheckIns: number;
        avgMood: number;
        avgEnergy: number;
        avgStress: number;
        burnoutRisk: number;
        stability: number;
        streak: number;
        recentTrend: 'improving' | 'stable' | 'declining';
        insights: Insight[];
        recentEntries: TimelineEntry[];
    };
    team?: {
        avgMood: number;
        avgEnergy: number;
        avgStress: number;
        activeMembers: number;
        totalCheckIns: number;
        participationRate: number;
        riskLevel: 'stable' | 'elevated' | 'concerning';
        recentActivity: TeamActivity[];
    };
}

export interface TeamAnalyticsResponse {
    organization: {
        name: string;
        memberCount: number;
        activeMembers: number;
        overallResonance: number;
    };
    memberStats: MemberStat[];
    moodDistribution: MoodDistribution;
    riskSummary: {
        stableCount: number;
        elevatedCount: number;
        concerningCount: number;
    };
    trends: TrendPoint[];
}

export interface MemberStat {
    id: string;
    name: string;
    role: Role;
    checkInCount: number;
    avgMood: number | null;
    riskScore: number;
    lastCheckIn: ISO8601 | null;
    status: 'critical' | 'warning' | 'stable';
}





export interface SentimentInput {
    text: string;
    context?: {
        recentMood: MoodType;
        timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    };
}

export interface SentimentOutput {
    sentiment: number; 
    confidence: number; 
    emotions: EmotionBreakdown;
}

export interface BurnoutInput {
    userId: string;
    period: '7d' | '14d' | '30d';
    checkins: CheckIn[];
}

export interface BurnoutOutput {
    riskScore: number; 
    components: {
        stressScore: number;
        exhaustionScore: number;
        volatilityScore: number;
    };
    trend: 'improving' | 'stable' | 'worsening';
    recommendation?: string;
}

export interface InsightInput {
    userId: string;
    recentCheckins: CheckIn[];
    currentBurnout: number;
    patterns: string[];
}

export interface InsightOutput {
    insights: Omit<Insight, 'id' | 'userId' | 'isRead' | 'createdAt'>[];
}





export interface RealtimeCheckIn {
    event: 'checkin.created';
    payload: {
        teamId: string;
        mood: MoodType;
        timestamp: ISO8601;
    };
}

export interface RealtimePulseUpdate {
    event: 'pulse.updated';
    payload: PulseSnapshot;
}

export type RealtimeEvent = RealtimeCheckIn | RealtimePulseUpdate;





export interface FeatureFlag {
    key: string;
    enabled: boolean;
    rolloutPercentage: number;
    orgIds: string[];
    userIds: string[];
}
