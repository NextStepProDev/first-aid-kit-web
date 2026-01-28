# First Aid Kit - Web Application

![React](https://img.shields.io/badge/React-19-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38bdf8)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

Modern React application for managing your home first aid kit. Track medications, get expiration alerts, and never run out of essential medicines.

## Features

- **Dashboard** - Overview with statistics (total, expired, expiring soon)
- **Drug Management** - Full CRUD operations with filtering and sorting
- **Authentication** - Login, registration, password reset
- **Admin Panel** - User management for administrators
- **PDF Export** - Download your medication list
- **Dark Theme** - Modern UI with dark color scheme
- **Responsive** - Works on desktop and mobile

## Tech Stack

- **React 19** with TypeScript
- **Tailwind CSS 4.0** for styling
- **TanStack React Query** for server state management
- **React Hook Form + Zod** for form validation
- **Axios** with JWT interceptors
- **React Router DOM v7** for routing
- **lucide-react** for icons

## Prerequisites

- Node.js 20+
- npm or yarn
- Backend API running (see [first-aid-kit-api](https://github.com/NextStepProDev/first-aid-kit-api))

## Quick Start

### Option 1: Docker (Recommended - Full Stack)

The easiest way to run the complete application is using the deployment hub:

```bash
git clone https://github.com/NextStepProDev/first-aid-kit-manager-hub.git
cd first-aid-kit-manager-hub
cp .env.example .env
# Edit .env with your credentials
docker compose up -d
```

Access the app at http://localhost

### Option 2: Development Mode

For local development with hot reload:

1. Clone the repository:
```bash
git clone https://github.com/NextStepProDev/first_aid_kit_frontend.git
cd first_aid_kit_frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will be available at http://localhost:3000

> **Note:** You need the backend API running at `http://localhost:8082` (or configure `REACT_APP_API_URL`).

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `REACT_APP_API_URL` | `http://localhost:8082` | Backend API URL |

Create a `.env.local` file for local overrides:

```bash
REACT_APP_API_URL=http://localhost:8080
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm test` | Run tests |
| `npm run build` | Create production build |
| `npm run eject` | Eject from CRA (irreversible) |

## Project Structure

```
src/
├── api/              # Axios client and API endpoint functions
├── components/       # Reusable UI components
│   ├── ui/          # Base components (Button, Input, Card, etc.)
│   └── features/    # Feature-specific components
├── contexts/        # React contexts (AuthContext)
├── hooks/           # Custom React hooks
├── pages/           # Route page components
│   ├── Dashboard.tsx
│   ├── DrugList.tsx
│   ├── Login.tsx
│   └── ...
├── types/           # TypeScript interfaces and types
├── utils/           # Helper functions
├── App.tsx          # Main app component with routing
└── index.tsx        # Entry point
```

## API Integration

The app communicates with the backend via REST API. Key features:

- **JWT Authentication** - Automatic token refresh on 401 responses
- **Request Interceptors** - Attach Authorization header to all requests
- **Error Handling** - Global error handling with user-friendly messages

## Building for Production

```bash
npm run build
```

Creates an optimized build in the `build/` folder, ready for deployment.

## Related Repositories

| Repository | Description |
|------------|-------------|
| [first-aid-kit-manager-hub](https://github.com/NextStepProDev/first-aid-kit-manager-hub) | Docker deployment hub |
| [first-aid-kit-api](https://github.com/NextStepProDev/first-aid-kit-api) | Backend REST API |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with care by [Mateusz Nawratek](https://www.linkedin.com/in/mateusz-nawratek-909752356)
