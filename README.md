# Onboarding Tour Platform - ZenGuide

A comprehensive onboarding tour platform built with Next.js, Convex, and modern web technologies. This platform enables businesses to create, manage, and analyze interactive onboarding tours for their users.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Scripts](#scripts)
- [Architecture](#architecture)
- [Building for Production](#building-for-production)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

---

## Overview

The Onboarding Tour Platform is a full-stack application that allows product teams to create interactive guided tours for their applications. It provides a dashboard for managing tours, analytics for tracking user engagement, and embeddable components for seamless integration.

---

## Features

### Authentication
- User signup and login
- Password reset flow with OTP verification
- Secure session management via middleware

### Dashboard
- **Main Dashboard** - Overview of tours and metrics
- **Tours Management** - Create, edit, and delete tours
- **Individual Tour Editor** - Detailed tour configuration
- **Analytics** - Track tour performance and user engagement
- **Settings** - Account and application settings

### Public Pages
- **Landing Page** - Marketing homepage
- **About** - Company information
- **Demo** - Interactive product demo
- **Documentation** - API and usage docs

### UI/UX
<!-- - Dark/Light theme support -->
- Responsive design with Tailwind CSS
- Loading states
- Error boundaries
- 404 handling

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js (App Router) |
| **Language** | TypeScript |
| **Backend/Database** | Convex |
| **Styling** | Tailwind CSS |
| **Linting** | ESLint |
| **Formatting** | Prettier |
| **Package Manager** | pnpm |

---

## Project Structure

```typescript
onboarding-tour-platform/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes (grouped)
│   │   └── auth/
│   │       ├── login/
│   │       ├── signup/
│   │       ├── forgot-password/
│   │       └── reset-password/
│   ├── (dashboard)/              # Protected dashboard routes
│   │   └── dashboard/
│   │       ├── analytics/
│   │       ├── settings/
│   │       └── tours/
│   ├── (external-pages)/         # Public marketing pages
│   │   ├── about/
│   │   ├── demo/
│   │   └── docs/
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── error.tsx                 # Error boundary
│   ├── loading.tsx               # Loading UI
│   └── not-found.tsx             # 404 page
├── components/                   # React components
│   ├── ui/                       # Reusable UI components
│   ├── layout/                   # Layout components
│   ├── dashboard/                # Dashboard-specific components
│   ├── demo/                     # Demo page components
│   └── external-pages/           # Public page components
├── convex/                       # Convex backend functions
├── context/                      # React context providers
├── contexts/                     # Additional contexts
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions
├── types/                        # TypeScript type definitions
├── data/                         # Static data/constants
├── public/                       # Static assets
├── middleware.ts                 # Next.js middleware (auth, redirects)
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── eslint.config.mjs             # ESLint configuration
├── postcss.config.mjs            # PostCSS configuration
└── .prettierrc                   # Prettier configuration
```

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 20.x
- **pnpm** >= 8.x (recommended)
- **Git**
- **Convex Account** - [Sign up at convex.dev](https://convex.dev)

### Verify Installation

```bash
# Check Node.js version
node --version

# Check pnpm version
pnpm --version

# Check Git version
git --version
```

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/onboarding-tour-platform.git
cd onboarding-tour-platform
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Convex

```bash
# Login to Convex
pnpm convex login

# Initialize Convex (if not already done)
pnpm convex init

# Deploy Convex functions
pnpm convex dev
```

### 4. Configure Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env.local
```

---

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Convex
CONVEX_DEPLOYMENT=your-convex-deployment
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Authentication (if using external auth provider)
AUTH_SECRET=your-auth-secret
NEXT_PUBLIC_AUTH_URL=http://localhost:3000

# Analytics (optional)
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# API Keys (if applicable)
API_KEY=your-api-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Onboarding Tour Platform
```

### Required Variables

| Variable | Description |
|----------|-------------|
| `CONVEX_DEPLOYMENT` | Your Convex deployment identifier |
| `NEXT_PUBLIC_CONVEX_URL` | Public Convex URL for client-side access |

### Optional Variables

| Variable | Description |
|----------|-------------|
| `AUTH_SECRET` | Secret for signing authentication tokens |
| `NEXT_PUBLIC_ANALYTICS_ID` | Google Analytics or similar tracking ID |

---

## Development

### Start the Development Server

Run both Next.js and Convex in development mode:

```bash
# Terminal 1: Start Convex dev server
pnpm convex dev

# Terminal 2: Start Next.js dev server
pnpm dev
```

Or use a single command if configured:

```bash
pnpm dev:all
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Development URLs

| URL | Description |
|-----|-------------|
| `http://localhost:3000` | Main application |
| `http://localhost:3000/dashboard` | Dashboard |
| `http://localhost:3000/auth/login` | Login page |
| `http://localhost:3000/auth/signup` | Signup page |
| `http://localhost:3000/demo` | Interactive demo |
| `http://localhost:3000/docs` | Documentation |
| `http://localhost:3000/about` | About page |

---

## Scripts

Available scripts in `package.json`:

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `pnpm dev` | Start Next.js development server |
| `build` | `pnpm build` | Build for production |
| `start` | `pnpm start` | Start production server |
| `lint` | `pnpm lint` | Run ESLint |
| `lint:fix` | `pnpm lint:fix` | Fix ESLint errors |
| `format` | `pnpm format` | Format code with Prettier |
| `format:check` | `pnpm format:check` | Check formatting |
| `type-check` | `pnpm type-check` | Run TypeScript compiler check |
| `convex dev` | `pnpm convex dev` | Run Convex in development mode |
| `convex deploy` | `pnpm convex deploy` | Deploy Convex functions to production |

---

## Architecture

### Route Groups

The app uses Next.js route groups for logical organization:

| Group | Purpose | Auth Required |
|-------|---------|---------------|
| `(auth)` | Authentication pages (login, signup, password reset) | No |
| `(dashboard)` | Protected routes requiring authentication | Yes |
| `(external-pages)` | Public marketing and documentation pages | No |

### Middleware

The `middleware.ts` file handles:
- Authentication verification
- Protected route redirection
- Session management

### State Management

- **Convex** - Server state and real-time data
- **React Context** - Client-side state (theme, user preferences)
- **Custom Hooks** - Reusable stateful logic

### Component Architecture

```
components/
├── ui/              # Primitive UI components (buttons, inputs, cards)
├── layout/          # Page layouts, navigation, footers
├── dashboard/       # Dashboard-specific composite components
├── demo/            # Demo page components
└── external-pages/  # Marketing page components
```

### Data Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   Convex    │────▶│  Database   │
│  (Next.js)  │◀────│  Functions  │◀────│  (Convex)   │
└─────────────┘     └─────────────┘     └─────────────┘
```

---

## Building for Production

### 1. Build the Application

```bash
pnpm build
```

### 2. Deploy Convex Functions

```bash
pnpm convex deploy
```

### 3. Start Production Server

```bash
pnpm start
```

### Deployment Platforms

The application can be deployed to:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Docker** (custom hosting)

#### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

#### Environment Variables for Production

Make sure to set the following environment variables in your hosting platform:

```
CONVEX_DEPLOYMENT=prod:your-deployment
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
AUTH_SECRET=your-production-secret
```

---

## Testing

```bash
# Run unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run e2e tests
pnpm test:e2e

# Generate coverage report
pnpm test:coverage
```

---

## Troubleshooting

### Common Issues

#### Convex Connection Issues

```bash
# Reset Convex
pnpm convex dev --reset

# Re-authenticate
pnpm convex logout
pnpm convex login
```

#### TypeScript Errors

```bash
# Clear Next.js cache
rm -rf .next
pnpm dev

# Regenerate types
pnpm convex dev
```

#### Dependency Issues

```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
pnpm dev -p 3001
```

#### Build Failures

```bash
# Clear all caches
rm -rf .next node_modules/.cache
pnpm build
```

---

## Contributing

We welcome contributions! Please follow these steps:

### Quick Start for Contributors

1. **Fork the repository**

2. **Create a feature branch**
   ```bash
   git checkout -b feature/my-feature
   ```

3. **Make your changes**

4. **Run quality checks**
   ```bash
   pnpm lint
   pnpm type-check
   pnpm format:check
   ```

5. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add my feature"
   ```

6. **Push and open a PR**
   ```bash
   git push origin feature/my-feature
   ```

### Commit Message Convention

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only changes |
| `style` | Code style changes (formatting, etc.) |
| `refactor` | Code refactoring |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks |

### Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Onboarding Tour Platform

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Support

- 📧 **Email**: support@onboardingtour.com
- 💬 **Discord**: [Join our community](https://discord.gg/your-invite)
- 📖 **Documentation**: [docs.onboardingtour.com](https://docs.onboardingtour.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-org/onboarding-tour-platform/issues)

---

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Convex](https://convex.dev/) - Backend platform
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Shadcn/UI](https://ui.shadcn.com/) - UI components
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [pnpm](https://pnpm.io/) - Fast, disk space efficient package manager

---

<p align="center">
  Made with ❤️ by the Onboarding Tour Platform Team
</p>