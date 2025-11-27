# Disha Career Discovery Platform - Claude Code Project Guide

## Project Overview

Disha is an interactive career discovery platform built with React, TypeScript, and Vite. The platform helps users explore career paths through engaging quizzes and provides comprehensive career guidance with college and scholarship information.

## Tech Stack & Architecture

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite (configured for development on port 8082)
- **Styling**: Tailwind CSS with custom configuration
- **UI Components**: Radix UI primitives for accessibility
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: React Router DOM
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **State Management**: React Query (@tanstack/react-query)
- **Backend**: Supabase (PostgreSQL database with @supabase/supabase-js client)

## Project Structure

**IMPORTANT**: The main application code is in the `frontend/` directory. All development and build commands should be run from `frontend/`.

```
/Users/rajeshnaik/Projects/Disha Project/Disha/
├── frontend/                 # ⭐ Main React application (work here)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/           # Reusable UI components (Radix-based)
│   │   │   ├── CareerDetails.tsx
│   │   │   ├── CareerSearch.tsx
│   │   │   ├── CollegesScholarships.tsx
│   │   │   ├── ExamDetailsModal.tsx
│   │   │   ├── Quiz.tsx
│   │   │   └── QuizResults.tsx
│   │   ├── pages/
│   │   │   ├── Index.tsx     # Main landing page
│   │   │   └── NotFound.tsx
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utility functions
│   │   ├── integrations/
│   │   │   └── supabase/     # Supabase client (@supabase/supabase-js)
│   │   └── ...
│   ├── public/               # Static assets
│   ├── package.json          # Frontend dependencies (source of truth)
│   ├── vite.config.ts        # Vite config (dev server: port 8082)
│   ├── dist/                 # Build output
│   └── ...
├── infrastructure/           # AWS CDK infrastructure code
│   └── cdk/                  # CloudFormation stack definitions
├── backend/                  # Backend services
├── rest-api/                 # REST API
├── package.json              # Root-level (legacy, not used for app builds)
├── .github/workflows/        # CI/CD workflows (builds from frontend/)
└── setup.sh                  # Automated setup script
```

## Key Components

### Core Features
- **Quiz.tsx**: Interactive career interest assessment
- **QuizResults.tsx**: Results display and analysis
- **CareerDetails.tsx**: Detailed career information
- **CareerSearch.tsx**: Career exploration interface
- **CollegesScholarships.tsx**: Educational guidance
- **ExamDetailsModal.tsx**: Examination information

### UI System
The project uses a comprehensive design system built on Radix UI primitives located in `frontend/src/components/ui/`. Components include:
- Forms, buttons, inputs, dialogs
- Data display (tables, cards, charts)
- Navigation components
- Feedback components (alerts, toasts)

## Development Commands

**IMPORTANT**: Run all commands from the `frontend/` directory.

```bash
# Navigate to frontend directory first
cd frontend

# Development
npm run dev          # Start dev server on localhost:8082
npm run typecheck    # TypeScript type checking
npm run lint         # ESLint code quality

# Build
npm run build        # Production build
npm run preview      # Preview production build
```

## Development Guidelines

### Code Conventions
- TypeScript strict mode enabled
- ESLint configuration with React-specific rules
- Tailwind CSS for styling (avoid inline styles)
- Use existing UI components from `/components/ui/`
- React Hook Form for form handling
- Zod for validation schemas

### File Organization
- Components in `frontend/src/components/` (feature-specific)
- Reusable UI in `frontend/src/components/ui/`
- Pages in `frontend/src/pages/`
- Custom hooks in `frontend/src/hooks/`
- Utilities in `frontend/src/lib/`
- Supabase integration in `frontend/src/integrations/supabase/`

### Styling
- Tailwind CSS utility classes
- Follow existing design patterns
- Use CSS variables for theming
- Responsive design patterns established

## Testing & Quality

Run from `frontend/` directory:

- **Type Checking**: `npm run typecheck`
- **Linting**: `npm run lint`
- **Build Verification**: `npm run build`

Always run these commands before committing changes.

## Deployment

The project uses AWS infrastructure with GitHub Actions for CI/CD:

- **Build Output**: `frontend/dist/` folder (optimized by Vite)
- **Hosting**: AWS S3 + CloudFront CDN
- **Environments**:
  - **Development**: Auto-deploys from `develop` branch
  - **Production**: Manual deployment from `main` branch (requires approval)
- **Infrastructure**: Managed with AWS CDK (see `infrastructure/` directory)
- **CI/CD**: GitHub Actions workflows build from `frontend/` directory

## Project Status

- Initial setup completed with comprehensive UI component library
- Core career discovery features implemented
- Ready for feature development and customization
- Modern development toolchain configured

## Notes for Claude Code

- **Working Directory**: Always work in the `frontend/` directory for React app development
- **Backend**: Uses Supabase for database (PostgreSQL) - client configured in `frontend/src/integrations/supabase/`
- **Data Management**: Supabase client handles data operations (@supabase/supabase-js)
- **UI Components**: Fully typed with TypeScript
- **Development Server**: Runs on port 8082 (configured in `frontend/vite.config.ts`)
- **Build System**: GitHub Actions builds from `frontend/` directory and deploys to AWS
- **Dependencies**: The `frontend/package.json` is the source of truth for all frontend dependencies