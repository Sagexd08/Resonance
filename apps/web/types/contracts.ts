// ============================================================================
// RESONANCE DATA CONTRACTS
// Type definitions for all data flowing through the system
// ============================================================================

// ============================================================================
// CORE TYPES
// ============================================================================

export type MoodType = 'Energized' | 'Happy' | 'Neutral' | 'Drained';

export type Role = 'EMPLOYEE' | 'MANAGER' | 'ADMIN';

export type ISO8601 = string; // "2026-01-18T12:00:00Z"
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
    anonymityThreshold: number; // Min users before showing aggregates
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

// ============================================================================
// CHECK-IN & EMOTIONAL DATA
// ============================================================================

export interface CheckIn {
    id: string;
    userId: string;
    mood: MoodType;
    moodScore: number; // 1-10 derived from mood
    intensity: number; // 1-10
    energyScore: number; // 1-10
    stressScore: number; // 1-10
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

// ============================================================================
// EMOTIONAL VECTORS (AI-COMPUTED)
// ============================================================================

export interface EmotionalVector {
    id: string;
    userId: string;
    checkinId: string;
    sentimentScore: number; // -1 to 1
    energyScore: number; // 0 to 1
    stressScore: number; // 0 to 1
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

// ============================================================================
// BURNOUT & STABILITY SCORES
// ============================================================================

export interface BurnoutScore {
    id: string;
    userId: string;
    score: number; // 0-100
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
    score: number; // 0-100 (higher = more stable)
    moodVariance: number;
    energyVariance: number;
    period: '7d' | '14d' | '30d';
    computedAt: ISO8601;
}

// ============================================================================
// INSIGHTS (AI-GENERATED)
// ============================================================================

export type InsightType = 'reflection' | 'pattern' | 'suggestion' | 'celebration';

export interface Insight {
    id: string;
    userId?: string;
    teamId?: string;
    type: InsightType;
    title: string;
    body: string;
    confidence: number; // 0 to 1
    icon: string;
    isRead: boolean;
    createdAt: ISO8601;
}

// ============================================================================
// TRENDS & ANALYTICS
// ============================================================================

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

// ============================================================================
// TEAM METRICS (AGGREGATED, ANONYMOUS)
// ============================================================================

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
    userId: string; // Anonymized
    timestamp: ISO8601;
    mood: 'happy' | 'neutral' | 'drained';
}

// ============================================================================
// API RESPONSE CONTRACTS
// ============================================================================

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

// ============================================================================
// AI PIPELINE CONTRACTS
// ============================================================================

export interface SentimentInput {
    text: string;
    context?: {
        recentMood: MoodType;
        timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    };
}

export interface SentimentOutput {
    sentiment: number; // -1 to 1
    confidence: number; // 0 to 1
    emotions: EmotionBreakdown;
}

export interface BurnoutInput {
    userId: string;
    period: '7d' | '14d' | '30d';
    checkins: CheckIn[];
}

export interface BurnoutOutput {
    riskScore: number; // 0-100
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

// ============================================================================
// REALTIME CONTRACTS
// ============================================================================

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

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export interface FeatureFlag {
    key: string;
    enabled: boolean;
    rolloutPercentage: number;
    orgIds: string[];
    userIds: string[];
}
