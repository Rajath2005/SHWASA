# SHWASA

**Respiratory Acoustic Intelligence**

An open research prototype for respiratory sound classification.

## Overview
SHWASA is a Next.js-based web application serving as a live research prototype for evaluating and visualizing respiratory acoustic models.

## Tech Stack
- **Framework:** [Next.js 16](https://nextjs.org/)
- **UI & Styling:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Data Visualization:** [Recharts](https://recharts.org/)
- **Language:** TypeScript

## Getting Started

First, install the dependencies using `pnpm`:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

To connect the playground and dashboard to the COPD-EFF Express service, set the server-only API origin before starting Next.js:

```bash
COPD_EFF_API_URL=http://localhost:3001 pnpm dev
```

Next.js keeps browser requests same-origin at `/api/*` and rewrites them to the configured COPD-EFF service. Without this variable, the app remains in its local demonstration mode.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure
- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable UI components and research visualizations
- `lib/` - Utility functions
- `public/` - Static assets
