# FitCal — TDEE Calculator

## Stack
- Next.js 15 + TypeScript + Tailwind CSS v4
- shadcn/ui for all UI components — never raw HTML inputs/buttons
- App Router, server components by default, client components only when needed

## Rules
- Mobile-first design
- Use shadcn primitives for all UI
- Keep components in `components/`, page logic in `app/`
- Commit `.env.example`, never `.env`
- No persistence in v1 (no Supabase yet)

## Deployment
- GitHub → Railway (auto-deploy on push to main)
- Domain: fitcalc.net (DNS at Hover → Railway)

## Formulas
- BMR: Mifflin-St Jeor
  - Male: (10 × weight_kg) + (6.25 × height_cm) − (5 × age) + 5
  - Female: (10 × weight_kg) + (6.25 × height_cm) − (5 × age) − 161
- TDEE: BMR × activity multiplier
