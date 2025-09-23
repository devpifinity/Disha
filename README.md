# Disha - Career Discovery Platform

Disha is an interactive career discovery platform that helps users explore career paths through engaging quizzes and comprehensive career guidance. Built with React, TypeScript, and Vite for a modern, fast development experience.

## Features

- 🎯 Interactive career interest quiz
- 📊 Comprehensive career details and insights
- 🎓 College and scholarship information
- 📱 Responsive design with modern UI
- ⚡ Fast performance with Vite
- 🎨 Beautiful UI components with Radix UI and Tailwind CSS

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Icons**: Lucide React

## Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**

## Quick Start

### Option 1: Automated Setup (Recommended)

Run the setup script to automatically install dependencies and start the development server:

```bash
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Disha
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run clean` - Clean build artifacts and node_modules

## Project Structure

```
Disha/
├── frontend/           # Frontend source code
│   ├── public/         # Static assets
│   ├── src/           
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utility functions
│   │   └── ...
│   └── ...
├── dist/              # Production build output
├── package.json       # Project dependencies and scripts
├── vite.config.ts     # Vite configuration
├── tailwind.config.ts # Tailwind CSS configuration
├── tsconfig.json      # TypeScript configuration
└── README.md          # This file
```

## Development

### Environment Variables

Copy the example environment file and configure as needed:

```bash
cp .env.example .env
```

### Adding New Features

1. Create components in `frontend/src/components/`
2. Add pages in `frontend/src/pages/`
3. Update routing in `frontend/src/App.tsx`
4. Use existing UI components from `frontend/src/components/ui/`

### Styling

This project uses Tailwind CSS for styling. The configuration is in `tailwind.config.ts`.

- Use existing utility classes when possible
- Follow the design system established in the UI components
- Custom components should be added to `frontend/src/components/ui/`

## Building for Production

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Preview the build**
   ```bash
   npm run preview
   ```

The production build will be generated in the `dist/` directory.

## Deployment

### Static Hosting (Netlify, Vercel, etc.)

1. Build the project: `npm run build`
2. Deploy the `dist/` folder to your hosting service

### Docker (Optional)

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Change the port in `vite.config.ts` or kill the process using port 8080

2. **Module not found errors**
   - Run `npm install` to ensure all dependencies are installed
   - Clear cache: `npm run clean && npm install`

3. **TypeScript errors**
   - Run `npm run typecheck` to see all type errors
   - Ensure all required types are installed

### Getting Help

- Check the [Issues](../../issues) page for known problems
- Create a new issue if you encounter a bug
- Review the component documentation in `frontend/src/components/ui/`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is proprietary. All rights reserved.

## Contact

For questions or support, please contact the Disha development team.