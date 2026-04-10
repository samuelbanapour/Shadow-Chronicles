# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### Dark Sovereign RPG (`artifacts/evil-rpg`)
- **Type**: React + Vite, frontend-only (no backend required)
- **Preview path**: `/`
- **Description**: A dark fantasy browser RPG with a complex, branching storyline
- **Features**:
  - 4 playable classes: Shadowblade, Necromancer, Warlord, Plague Doctor
  - 4 full chapters with ~30+ scenes and 50+ narrative choices
  - Multiple distinct endings: Dark Triumph, True Evil, Sacrifice, Reformer, True Jailer (Hidden Redemption)
  - Full character stats system: health, mana, corruption, strength, cunning, darkness, gold, XP/leveling
  - Inventory system with items acquired through choices
  - Kill count, betrayal tracking, soul tracking
  - Auto-save to localStorage with continue support
  - Morality system (Evil, Dark, Neutral, Ambiguous choices)
  - Procedural audio system: ambient drones per mood (9 moods), SFX (choice click, scene transition, crow, heartbeat, thunder, sword, spell), crossfade between scenes, mute toggle with localStorage persistence
  - Cinematic UI: dark gothic fonts (Cinzel, IM Fell English), atmospheric backgrounds, scanlines effect
- **Key files**:
  - `src/game/types.ts` — all TypeScript types
  - `src/game/storyline.ts` — all scenes, narrative, and choices
  - `src/game/classes.ts` — 4 playable classes
  - `src/game/engine.ts` — game state management, save/load
  - `src/pages/TitleScreen.tsx` — animated title screen
  - `src/pages/CharacterCreation.tsx` — 3-step character creation
  - `src/pages/GameScreen.tsx` — main gameplay screen with sidebar stats
  - `src/services/audioService.ts` — procedural Web Audio API ambient + SFX engine

### API Server (`artifacts/api-server`)
- **Type**: Express 5 API server
- **Preview path**: `/api`
- **Endpoints**:
  - `GET /api/healthz` — health check
  - `POST /api/feedback` — save playtester feedback (rating + message) to PostgreSQL
- **Database**: Uses `@workspace/db` with `feedbackTable` schema

## Feedback System
- **DB Table**: `feedback` (id, player_name, player_class, rating, message, created_at)
- **API**: `POST /api/feedback` accepts `{ rating, message, playerName?, playerClass? }`
- **Frontend**: `FeedbackModal` component in `artifacts/evil-rpg/src/components/FeedbackModal.tsx`
- **Access**: "Share Feedback" button on TitleScreen

## Deployment
Both artifacts are production-ready:
- **API server**: Builds with esbuild, runs with Node.js in production (autoscale target)
- **Game frontend**: Builds as static files, served statically in production
- User must click Publish button in the main Replit UI to deploy
