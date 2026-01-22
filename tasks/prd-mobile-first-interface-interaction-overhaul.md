# Mobile-First Interface & Interaction Overhaul

## Overview
This epic focuses on transforming the application into a seamless "mobile-first" experience. It addresses critical layout issues, implements a robust 4-way swipe interaction logic, introduces an onboarding tutorial, and adds essential persistent navigation.

## Goals
- Eliminate horizontal scrolling and layout instability on mobile devices.
- Implement precise 4-direction swipe gestures with distinct actions.
- Provide immediate user guidance via a tutorial card.
- Enable persistent navigation throughout the app flow.

## Quality Gates
These commands must pass for every user story:
- `npm run typecheck`
- `npm run lint`

## User Stories

### US-001: Fix Mobile Viewport Layout
**Description:** As a mobile user, I want the application interface to be contained within my screen without horizontal scrolling so that the experience feels native and polished.

**Acceptance Criteria:**
- [ ] Set main container to `overflow-x: hidden` to prevent horizontal scroll.
- [ ] Ensure all buttons and interactive elements respect safe-area margins (avoid notches/edges).
- [ ] Center the card stack dynamically for different screen widths.
- [ ] Verify layout on small (e.g., iPhone SE) and large mobile viewports.

### US-002: Implement 4-Directional Swipe Logic
**Description:** As a user, I want to swipe cards in four directions so that I can categorize content with "No", "Yes", "Maybe", and "Skip" actions.

**Acceptance Criteria:**
- [ ] Implement Left Swipe action: "No" (Reject).
- [ ] Implement Right Swipe action: "Yes" (Like/Accept).
- [ ] Implement Up Swipe action: "Maybe" (Details/Super Like).
- [ ] Implement Down Swipe action: "Skip" (Dismiss/Next).
- [ ] Add visual feedback (rotation/opacity) during the drag gesture.
- [ ] Ensure action triggers only after a defined swipe threshold is crossed.

### US-003: Add Onboarding Tutorial Card
**Description:** As a new user, I want to see an instructional card at the start of the stack so that I understand the 4-way swipe controls.

**Acceptance Criteria:**
- [ ] Create a "Tutorial Card" visual design showing the 4 directions.
- [ ] Insert this card as the very first item in the card stack.
- [ ] Ensure the card behaves like a normal card (requires swipe to dismiss).
- [ ] Implement logic to show this card only once (one-time) per user/install.

### US-004: Create Persistent Footer Navigation
**Description:** As a user, I want a fixed menu at the bottom of the screen so that I can easily return home or reset the stack.

**Acceptance Criteria:**
- [ ] Implement a sticky footer bar fixed to the viewport bottom.
- [ ] Add "Home" button that navigates to the landing page.
- [ ] Add "Reset All" button that restarts the current session/stack.
- [ ] Ensure footer `z-index` keeps it above the swipeable area but doesn't obscure content.

## Functional Requirements
- FR-1: The app must prevent native browser back/forward gestures from interfering with swipes.
- FR-2: Swipe animations must be smooth (60fps) on mobile devices.
- FR-3: The "Reset All" action must reload the card stack including the tutorial card (if logic dictates reset clears "seen" state, otherwise just content).

## Non-Goals
- Tablet or Desktop specific optimizations (Mobile only).
- Complex animations beyond standard swipe physics.
- User profile or settings management (for now).

## Technical Considerations
- Use a gesture library like `react-use-gesture` or `framer-motion` for consistent physics.
- Ensure touch targets are at least 44x44px for accessibility.

## Success Metrics
- Zero instances of horizontal scroll on supported mobile devices.
- Successful completion of swipe actions in all 4 directions during testing.