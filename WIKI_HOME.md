# Disha - Career Discovery Platform

> **Disha** (Hindi: दिशा, meaning "Direction") - Guiding students towards their ideal career path

---

## Overview

Disha is an interactive career discovery platform designed to help students explore career paths through intelligent quizzes and comprehensive guidance. The platform combines engaging user experience with data-driven insights to provide personalized career recommendations tailored for Indian students.

### Mission

To empower students with the knowledge and tools they need to make informed career decisions by providing:
- Personalized career assessments
- Comprehensive career information
- College and scholarship guidance
- Clear educational pathways

---

## Target Users

| User Type | Description |
|-----------|-------------|
| High School Students | Grades 9-12 exploring career options and stream selection |
| College Students | Those considering specializations or career transitions |
| Parents & Counselors | Seeking guidance tools for students |
| Job Seekers | Looking for career pivot opportunities |

---

## Key Features

### 1. Interactive Career Quiz

A 10-question personalized assessment that analyzes interests, skills, and preferences.

**How it works:**
- Answer questions about activities, strengths, and motivations
- Weighted scoring algorithm (key questions weighted 1.5x)
- Identifies primary and secondary career types
- Detects multi-talented/hybrid profiles

### 2. Career Classification System

Careers are organized into **6 distinct types**:

| Type | Category | Example Careers |
|------|----------|-----------------|
| **A** | Problem Solver & Tech Innovator | Software Engineer, Data Scientist, AI Engineer |
| **B** | Helper & Life Sciences Explorer | Doctor, Nurse, Pharmacist, Veterinarian |
| **C** | Business Leader & Strategic Thinker | Business Manager, Entrepreneur, Financial Advisor |
| **D** | People Person & Community Builder | Teacher, Lawyer, Social Worker, Counselor |
| **E** | Creative Innovator & Artist | Graphic Designer, Film Director, Photographer |
| **F** | Builder & Technical Craftsperson | Civil Engineer, Mechanic, Electrician |

### 3. Comprehensive Career Details

Each career page includes:
- Career snapshot and key highlights
- **Recommended stream** (PCM/PCB/Commerce/Arts)
- Essential subjects for high school
- Student path example (realistic progression)
- Step-by-step education pathway
- Entrance exams (JEE, NEET, GATE, CUET, etc.)
- Required skills (soft + technical)
- Career options and job titles
- Future outlook and industry demand

### 4. Colleges & Scholarships Finder

- Search colleges by career path
- View ratings, fees, and admission capacity
- Entrance exam requirements
- Scholarship information
- Course offerings and program duration

### 5. Smart Hybrid Profiles

The platform recognizes that students often have multiple interests:

| Combination | Suggested Careers |
|-------------|-------------------|
| A + E | UI/UX Designer, Game Developer |
| A + C | Tech Entrepreneur, Product Manager |
| B + D | Public Health Educator |
| C + D | EdTech Manager |
| B + C | Healthcare Administrator |

---

## User Journey

```
                    +------------------+
                    |   Landing Page   |
                    +--------+---------+
                             |
            +----------------+----------------+
            |                                 |
            v                                 v
    +-------+-------+               +---------+--------+
    |  Start Quiz   |               |  Browse Careers  |
    +-------+-------+               +---------+--------+
            |                                 |
            v                                 |
    +-------+-------+                         |
    | 10 Questions  |                         |
    +-------+-------+                         |
            |                                 |
            v                                 |
    +-------+-------+                         |
    | Quiz Results  |                         |
    | (Career Type) |                         |
    +-------+-------+                         |
            |                                 |
            +----------------+----------------+
                             |
                             v
                    +--------+--------+
                    | Career Details  |
                    +--------+--------+
                             |
                             v
                    +--------+---------+
                    | Colleges &       |
                    | Scholarships     |
                    +------------------+
```

---

## Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Tailwind CSS | Styling |
| Radix UI | Accessible Components |
| React Query | State Management |
| React Hook Form + Zod | Form Handling & Validation |
| Recharts | Data Visualization |

### Backend & Database
| Technology | Purpose |
|------------|---------|
| Supabase | Backend-as-a-Service |
| PostgreSQL | Database |
| Supabase Auth | Authentication (ready) |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| AWS S3 + CloudFront | Hosting & CDN |
| AWS CDK | Infrastructure-as-Code |
| GitHub Actions | CI/CD Pipeline |

---

## Database Schema

### Core Tables

```
career_cluster          career_path              skill
+---------------+       +-------------------+    +---------------+
| id            |       | id                |    | id            |
| name          |<------| career_cluster_id |    | name          |
| description   |       | name              |    | category      |
+---------------+       | description       |    | description   |
                        | snapshot          |    +-------+-------+
                        | recommended_stream|            |
                        | essential_subjects|            |
                        | education_pathway |    +-------+-------+
                        | entrance_exams    |    | careerpath_   |
                        | industry_demand   |    | skills        |
                        | highlights        |    +---------------+
                        | slug              |
                        +--------+----------+
                                 |
         +-----------+-----------+-----------+
         |           |                       |
         v           v                       v
+--------+--+  +-----+------+        +------+------+
| entrance  |  | job_       |        | college_    |
| _exam     |  | opportunity|        | course      |
+-----------+  +------------+        +------+------+
                                            |
                                            v
                                     +------+------+
                                     | college     |
                                     +-------------+
```

---

## Project Structure

```
Disha/
├── frontend/                    # Main React Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # 60+ Reusable UI Components
│   │   │   ├── Quiz.tsx         # Career Assessment Quiz
│   │   │   ├── QuizResults.tsx  # Results & Recommendations
│   │   │   ├── CareerDetails.tsx
│   │   │   ├── CareerSearch.tsx
│   │   │   └── CollegesScholarships.tsx
│   │   ├── pages/
│   │   │   └── Index.tsx        # Landing Page
│   │   ├── lib/                 # Utilities & Queries
│   │   └── integrations/
│   │       └── supabase/        # Database Client
│   └── package.json
├── infrastructure/
│   ├── cdk/                     # AWS CDK Stacks
│   └── scripts/db/              # Database Migrations
├── backend/                     # Backend Services
└── .github/workflows/           # CI/CD Pipelines
```

---

## Development

### Quick Start

```bash
# Clone the repository
git clone https://github.com/devpifinity/disha.git

# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server (port 8082)
npm run dev
```

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run typecheck` | Run TypeScript checks |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

---

## Deployment

### Environments

| Branch | Environment | Deployment |
|--------|-------------|------------|
| `develop` | Development | Auto-deploy on push |
| `main` | Production | Manual approval required |

### Pipeline

```
Push to Branch
      |
      v
GitHub Actions
      |
      v
Build (npm run build)
      |
      v
Deploy to S3
      |
      v
CloudFront Invalidation
```

---

## Roadmap

### Current Status
- [x] Core quiz functionality
- [x] Career classification system
- [x] Career details pages
- [x] Database schema design
- [x] UI component library
- [x] Responsive design

### Upcoming Features
- [ ] User authentication
- [ ] Save quiz results to profile
- [ ] Career comparison tool
- [ ] Mentorship connections
- [ ] Career path simulations
- [ ] Regional language support
- [ ] Mobile app (React Native)

---

## Indian Education Context

Disha is specifically designed for the Indian education system:

### Stream Recommendations
- **PCM** (Physics, Chemistry, Math) - Engineering & Technology
- **PCB** (Physics, Chemistry, Biology) - Medical & Life Sciences
- **Commerce** - Business & Finance
- **Arts/Humanities** - Law, Design, Social Sciences

### Supported Entrance Exams
- JEE Main/Advanced (Engineering)
- NEET (Medical)
- CUET (Central Universities)
- GATE (Post-graduate Engineering)
- CAT (Management)
- CLAT (Law)
- NID/NIFT (Design)
- And many more...

---

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Guidelines
- Follow TypeScript strict mode
- Use existing UI components from `/components/ui/`
- Follow Tailwind CSS patterns
- Run `npm run typecheck` and `npm run lint` before commits

---

## Team

**Developed by DevPifinity**

---

## License

This project is proprietary software. All rights reserved.

---

## Links

- [GitHub Repository](https://github.com/devpifinity/disha)
- [Report Issues](https://github.com/devpifinity/disha/issues)
- [Documentation](./CLAUDE.md)

---

*Empowering students to find their direction.*
