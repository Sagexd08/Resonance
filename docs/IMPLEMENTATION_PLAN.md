# Resonance Implementation Plan

Based on the [Resonance PRD](./RESONANCE_PRD.md), this plan outlines the steps to build the end-to-end "Advanced" version of the platform.

## Phase 1: Foundation (Current Status: In Progress)
- [x] **Landing Page**: High-fidelity, animated, "ecstatic" design.
- [x] **Auth System**: NextAuth configured, basic Prisma User model.
- [ ] **Database Schema**: Update Prisma schema to support daily check-ins, teams, and basic risk metrics.
- [ ] **App Layout**: Create the dashboard shell (Sidebar/Dock, Topbar) distinct from the landing page.

## Phase 2: Core User Loops (Immediate Next Steps)

### 2.1 The Check-In Experience (Employee Flow)
**Objective**: Build the 30-second daily check-in loop.
- **Backend**:
    - [ ] Create `EmotionalEntry` mutation in API.
    - [ ] Add `Note` field processing (basic sentiment analysis preparation).
- **Frontend**:
    - [ ] Create `/app/check-in/page.tsx`.
    - [ ] Implement `MoodSelector` (Energy, Happiness, Stress).
    - [ ] Implement `NoteInput` with auto-growing textarea.
    - [ ] Success state with daily "AI Insight" (mocked initially, then connected to heuristic engine).

### 2.2 The Dashboard (Manager/Individual Flow)
**Objective**: Visualize the data.
- **Frontend**:
    - [ ] Create `/app/dashboard/page.tsx`.
    - [ ] **Personal Pulse**: Graph of user's own mood over the last 7/30 days.
    - [ ] **Team Pulse (Manager)**: Aggregated, anonymized heatmaps.
    - [ ] Use `recharts` or `visx` for data visualization.

## Phase 3: Advanced Intelligence (The "Advanced" part)

### 3.1 Algorithm Implementation
- **Burnout Risk Algo**:
    - `Risk = (AverageStress * 0.5) + (AverageExhaustion * 0.3) + (Volatility * 0.2)`
    - Implement this logic in a Service or Resolver.
    
### 3.2 Action Engine
- Create a rule-based engine that triggers recommendations based on scores.
- Example: If `TeamBurnout > 75`, suggest "No Meeting Friday".

## Execution Steps

1.  **Schema Update**: Verify `schema.prisma` has `EmotionalEntry`, `Team`, `User` relationships correct.
2.  **Dashboard Layout**: Scaffold the logged-in area.
3.  **Check-In Page**: Build the immersive check-in UI.
4.  **Dashboard Widgets**: Build the visualizations.
5.  **Connect**: Wire it all up with GraphQL/API routes.
