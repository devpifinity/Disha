# Disha Career Discovery Platform - Claude Code Project Guide

## Project Overview

Disha is an interactive career discovery platform built with React, TypeScript, and Vite. The platform helps users explore career paths through engaging quizzes and provides comprehensive career guidance with college and scholarship information.

## Tech Stack & Architecture

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite (configured for development on port 8080)
- **Styling**: Tailwind CSS with custom configuration
- **UI Components**: Radix UI primitives for accessibility
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: React Router DOM
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **State Management**: React Query (@tanstack/react-query)

## Project Structure

```
/Users/rajeshnaik/Projects/Disha Project/Disha/
├── frontend/
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
│   │   └── ...
│   └── public/               # Static assets
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── setup.sh                 # Automated setup script
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

```bash
# Development
npm run dev          # Start dev server on localhost:8080
npm run typecheck    # TypeScript type checking
npm run lint         # ESLint code quality

# Build
npm run build        # Production build
npm run preview      # Preview production build

# Utilities
npm run clean        # Clean dist and node_modules
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
- Components in `/components/` (feature-specific)
- Reusable UI in `/components/ui/`
- Pages in `/pages/`
- Custom hooks in `/hooks/`
- Utilities in `/lib/`

### Styling
- Tailwind CSS utility classes
- Follow existing design patterns
- Use CSS variables for theming
- Responsive design patterns established

## Testing & Quality

- **Type Checking**: `npm run typecheck`
- **Linting**: `npm run lint`
- **Build Verification**: `npm run build`

Always run these commands before committing changes.

## Deployment

The project builds to a `dist/` folder suitable for static hosting (Netlify, Vercel, etc.). The build process is optimized with Vite for fast loading and modern browser support.

## Project Status

- Initial setup completed with comprehensive UI component library
- Core career discovery features implemented
- Ready for feature development and customization
- Modern development toolchain configured

## Notes for Claude Code

- This is a client-side React application
- No backend API currently configured
- All data is handled client-side
- UI components are fully typed with TypeScript
- Development server runs on port 8080 (configured in Vite)