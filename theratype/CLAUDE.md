# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TheraType is a therapeutic typing platform that combines typing practice with mental health support. It's a React-based web application built as a digital healthcare (DTx) proof-of-concept.

## Development Commands

```bash
npm run dev      # Start dev server (with --host for network access)
npm run build    # Production build
npm run lint     # ESLint check
npm run preview  # Preview production build
```

## Tech Stack

- **Framework**: React 19 with Vite 7
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v3 with custom CSS variables for theming
- **Backend**: Firebase (Auth + Firestore) - configured via VITE_FIREBASE_* env vars
- **Charts**: Chart.js with react-chartjs-2

## Architecture

### Page Structure

The app has four main routes (see `src/App.jsx`):
- `/` - MainHub: Landing page with mode selection
- `/insight` - InsightMode: Psychology profiling through sentence pair selection
- `/therapy` - TherapyMode: Personalized therapeutic typing practice
- `/dashboard` - DashboardPage: Progress visualization

### Core Flow

1. **Insight Mode** (`src/pages/InsightMode.jsx`): Users select between contrasting sentence pairs (A/B) by typing their preferred choice. Selections are analyzed to determine a psychological profile.

2. **Profile Assignment** (`src/data/therapySentences.js`): Based on Insight Mode results, users are assigned to one of 4 profiles:
   - `self_esteem` - Self-esteem enhancement
   - `stress_management` - Stress management
   - `emotion_control` - Emotion regulation
   - `motivation` - Motivation enhancement
   - `demo` - Default for users who haven't completed Insight Mode

3. **Therapy Mode** (`src/pages/TherapyMode.jsx`): Provides profile-specific therapeutic sentences. Tracks mastery progress (3+ completions with 90%+ accuracy).

### Key Data Files

- `src/data/insightSentences.js`: 10 sentence pairs for psychological profiling across categories (self_perception, self_worth, stress_response, etc.)
- `src/data/therapySentences.js`: Profile-based therapeutic sentences with difficulty levels and scientific basis citations
- `src/data/modesConfig.js`: Mode configuration data

### Typing Analysis (`src/utils/typingAnalyzer.js`)

Provides utilities for:
- WPM calculation (Korean: chars/5 = words)
- Real-time accuracy using Levenshtein distance with prefix matching
- Character-by-character feedback
- Hesitation pattern detection (2s+ pauses)
- Typing rhythm/consistency analysis
- Copy-paste detection

### Theming System

Uses CSS custom properties defined in `src/index.css` for light/dark mode:
- Semantic tokens: `--bg-base`, `--bg-surface`, `--text-main`, `--text-muted`, etc.
- Brand colors: `--primary-*`, `--secondary-*`
- Theme toggle via `dark` class on html element

Tailwind config (`tailwind.config.js`) maps these variables to utility classes like `bg-bg-base`, `text-text-main`.

### Component Organization

```
src/components/
├── common/      # Reusable: Button, Card, Input, ThemeToggle
├── hub/         # Hub page: ModeCard
├── insight/     # Insight mode: SentencePair, TypingInput, InsightResult
├── therapy/     # Therapy mode: TherapySentence, ProfileBadge, ProgressTracker
└── layout/      # App layout with sidebar/mobile nav
```

### State Management

- Local state with React hooks
- `localStorage` for persistence:
  - `insightResults`: Profile assignment and selection history
  - `therapySessions`: Therapy mode session history

## Firebase Configuration

Create `.env.local` with:
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

The app runs without Firebase in development mode (mock data fallback).
