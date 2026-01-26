# First Aid Kit - Frontend Development Plan

## Project Overview

Frontend aplikacji do zarządzania domową apteczką. React + TypeScript + Tailwind CSS z ciemnym motywem.

**Backend:** Spring Boot 4, Java 25, JWT Auth, REST API na `http://localhost:8082` (profil local)

---

## Phase 1: Project Setup & Configuration

### 1.1 Fix Tailwind Configuration
- [x] Tailwind zainstalowany
- [ ] Naprawić `tailwind.config.js` (content jest pusty!)
- [ ] Skonfigurować ciemny motyw jako domyślny
- [ ] Dodać custom colors dla aplikacji medycznej

### 1.2 Install Dependencies
```bash
npm install react-router-dom           # Routing
npm install axios                       # HTTP client
npm install @tanstack/react-query       # Server state management
npm install react-hook-form             # Form handling
npm install zod @hookform/resolvers     # Form validation
npm install lucide-react                # Icons
npm install clsx tailwind-merge         # Utility for conditional classes
npm install react-hot-toast             # Notifications
```

### 1.3 Project Structure
```
src/
├── api/                    # API client & endpoints
│   ├── client.ts          # Axios instance with interceptors
│   ├── auth.ts            # Auth endpoints
│   └── drugs.ts           # Drug endpoints
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Table.tsx
│   │   ├── Badge.tsx
│   │   ├── Select.tsx
│   │   └── Spinner.tsx
│   ├── layout/
│   │   ├── Layout.tsx     # Main layout with sidebar/navbar
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   └── features/
│       ├── auth/          # Login, Register forms
│       └── drugs/         # Drug list, form, card
├── contexts/
│   └── AuthContext.tsx    # Auth state management
├── hooks/
│   ├── useAuth.ts
│   ├── useDrugs.ts
│   └── useDebounce.ts
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx  # Statistics overview
│   ├── DrugsPage.tsx      # Drug list with search
│   ├── DrugFormPage.tsx   # Add/Edit drug
│   ├── ProfilePage.tsx    # User profile & settings
│   └── NotFoundPage.tsx
├── types/
│   └── index.ts           # TypeScript interfaces
├── utils/
│   ├── cn.ts              # classNames utility
│   └── formatDate.ts
├── App.tsx
└── index.tsx
```

---

## Phase 2: Core Infrastructure

### 2.1 API Client Setup
- Axios instance z base URL
- Request interceptor: dodawanie JWT do headers
- Response interceptor: auto-refresh token przy 401
- Error handling

### 2.2 Auth Context
- Stan: user, isAuthenticated, isLoading
- Metody: login, register, logout, refreshToken
- Persystencja tokenów w localStorage
- Auto-refresh przed wygaśnięciem

### 2.3 Protected Routes
- PrivateRoute component
- Redirect do /login gdy brak auth
- Redirect do /dashboard gdy już zalogowany

---

## Phase 3: Pages Implementation

### 3.1 Authentication Pages

#### Login Page
- Email + Password inputs
- "Remember me" checkbox
- Link do rejestracji
- Link "Forgot password"
- Error handling (locked account, invalid credentials)

#### Register Page
- Username, Email, Password, Confirm Password
- Password strength indicator
- Validation (min 8 chars, uppercase, lowercase, digit, special char)
- Link do logowania

#### Forgot Password Page
- Email input
- Success message

#### Reset Password Page (z tokenem w URL)
- New password + confirm
- Validation

### 3.2 Main Application Pages

#### Dashboard Page (Home)
- Statystyki w kartach:
  - Total drugs
  - Active drugs (nie wygasłe)
  - Expired drugs (z alertem wizualnym)
  - Alerts sent
- Chart: drugs by form (pie/bar)
- Quick actions: Add drug, View all, Send alerts
- Ostatnio dodane leki (top 5)

#### Drugs Page (Lista)
- Search bar z debounce
- Filtry:
  - Form (dropdown)
  - Status: All / Active / Expired
  - Expiration date range
- Tabela z kolumnami:
  - Name
  - Form (badge)
  - Expiration Date (color-coded)
  - Description (truncated)
  - Actions (Edit, Delete)
- Pagination
- Sortowanie po kolumnach
- Empty state gdy brak wyników
- Export to PDF button

#### Drug Form Page (Add/Edit)
- Tryb: Create / Edit (na podstawie URL param)
- Pola:
  - Name (text)
  - Form (select z API /forms)
  - Expiration Year (select: current year + 10 years)
  - Expiration Month (select: 1-12)
  - Description (textarea)
- Validation z zod
- Submit → redirect to list
- Cancel button

#### Profile Page
- User info (email, username)
- Change password form
- Delete account (z confirmation modal)
- Logout button

---

## Phase 4: UI Components

### 4.1 Base Components
| Component | Props | Notes |
|-----------|-------|-------|
| Button | variant, size, loading, disabled | primary/secondary/danger/ghost |
| Input | label, error, type | With label & error message |
| Select | options, label, error | Single select |
| Textarea | label, error, rows | |
| Card | title, children | Container |
| Badge | variant | success/warning/danger/info |
| Modal | isOpen, onClose, title | With portal |
| Table | columns, data, loading | Generic table |
| Spinner | size | Loading indicator |
| Pagination | page, totalPages, onChange | |
| EmptyState | icon, message, action | |
| ConfirmDialog | message, onConfirm, onCancel | For deletions |

### 4.2 Feature Components
| Component | Description |
|-----------|-------------|
| DrugCard | Single drug display |
| DrugTable | Drugs list table |
| DrugForm | Add/Edit form |
| DrugFilters | Search + filters |
| StatsCard | Dashboard stat card |
| ExpirationBadge | Color-coded expiration status |

---

## Phase 5: Styling & Theme

### 5.1 Color Palette (Dark Theme)
```javascript
// tailwind.config.js
colors: {
  // Background
  dark: {
    900: '#0f0f0f',  // Main background
    800: '#1a1a1a',  // Card background
    700: '#2a2a2a',  // Elevated elements
    600: '#3a3a3a',  // Borders
  },
  // Primary (Medical blue/teal)
  primary: {
    500: '#0ea5e9',  // Main
    600: '#0284c7',  // Hover
    400: '#38bdf8',  // Light
  },
  // Status colors
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
}
```

### 5.2 Typography
- Font: Inter (clean, modern, readable)
- Sizes: sm, base, lg, xl, 2xl

### 5.3 Spacing & Layout
- Max container width: 1280px
- Sidebar width: 256px (collapsible to 64px)
- Card padding: 24px
- Gap between elements: 16px / 24px

---

## Phase 6: API Integration

### 6.1 Endpoints Mapping

| Frontend Action | Method | Endpoint | Auth Required |
|-----------------|--------|----------|---------------|
| Register | POST | /api/auth/register | No |
| Login | POST | /api/auth/login | No |
| Refresh Token | POST | /api/auth/refresh | No |
| Get Profile | GET | /api/auth/me | Yes |
| Forgot Password | POST | /api/auth/forgot-password | No |
| Reset Password | POST | /api/auth/reset-password | No |
| Change Password | POST | /api/auth/change-password | Yes |
| Delete Account | DELETE | /api/auth/account | Yes |
| Get Drug | GET | /api/drugs/{id} | Yes |
| Create Drug | POST | /api/drugs | Yes |
| Update Drug | PUT | /api/drugs/{id} | Yes |
| Delete Drug | DELETE | /api/drugs/{id} | Yes |
| Search Drugs | GET | /api/drugs/search | Yes |
| Get Forms | GET | /api/drugs/forms | Yes |
| Get Statistics | GET | /api/drugs/statistics | Yes |
| Export PDF | GET | /api/drugs/export/pdf | Yes |
| Send Alerts | POST | /api/email/alert | Yes |

### 6.2 Data Types (TypeScript)
```typescript
interface User {
  userId: number;
  username: string;
  email: string;
}

interface Drug {
  drugId: number;
  drugName: string;
  drugForm: DrugForm;
  expirationDate: string; // ISO date
  drugDescription: string;
}

interface DrugRequest {
  name: string;
  form: string;
  expirationYear: number;
  expirationMonth: number;
  description: string;
}

interface DrugStatistics {
  totalDrugs: number;
  expiredDrugs: number;
  activeDrugs: number;
  alertSentCount: number;
  drugsByForm: Record<string, number>;
}

type DrugForm =
  | 'GEL' | 'PILLS' | 'SYRUP' | 'DROPS' | 'SUPPOSITORIES'
  | 'SACHETS' | 'CREAM' | 'SPRAY' | 'OINTMENT' | 'LIQUID'
  | 'POWDER' | 'INJECTION' | 'BANDAGE' | 'INHALER' | 'PATCH'
  | 'SOLUTION' | 'OTHER';

interface FormOption {
  value: string;
  label: string;
}

interface JwtResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: number;
  username: string;
  email: string;
}

interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page (0-indexed)
}
```

---

## Phase 7: Testing

### 7.1 Unit Tests
- Components: React Testing Library
- Hooks: @testing-library/react-hooks
- Utils: Jest

### 7.2 Integration Tests
- API calls mocking with MSW
- Full page flows

---

## Phase 8: Build & Deploy

### 8.1 Environment Variables
```env
REACT_APP_API_URL=http://localhost:8082
```

### 8.2 Build Optimization
- Code splitting per route
- Lazy loading dla pages
- Image optimization

### 8.3 Deployment Options
1. **Vercel** (recommended for React)
2. **Netlify**
3. **Docker** (można spiąć z backendem)

---

## Implementation Order (Recommended)

### Week 1: Foundation
1. ✅ Project created
2. [ ] Fix Tailwind config
3. [ ] Install dependencies
4. [ ] Setup project structure
5. [ ] Create API client
6. [ ] Create base UI components (Button, Input, Card)

### Week 2: Auth Flow
7. [ ] AuthContext implementation
8. [ ] Login page
9. [ ] Register page
10. [ ] Protected routes
11. [ ] Token refresh logic

### Week 3: Core Features
12. [ ] Dashboard page with stats
13. [ ] Drugs list page
14. [ ] Drug form (add/edit)
15. [ ] Search & filters

### Week 4: Polish
16. [ ] Profile page
17. [ ] Password reset flow
18. [ ] Error handling & toasts
19. [ ] Loading states
20. [ ] Empty states
21. [ ] PDF export

### Week 5: Testing & Deploy
22. [ ] Write tests
23. [ ] Fix bugs
24. [ ] Optimize performance
25. [ ] Deploy

---

## Notes for Developer

### Backend CORS
Backend akceptuje requesty z:
- `http://localhost:3000` (Create React App default)
- `http://localhost:5173` (Vite default)

### JWT Token Storage
- Access token: localStorage (lub memory dla bezpieczeństwa)
- Refresh token: localStorage
- Token format: `Bearer {accessToken}` w header `Authorization`

### Error Responses
Backend zwraca błędy w formacie:
```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "fieldErrors": [
    { "field": "name", "message": "Drug name must not be blank" }
  ]
}
```

### Rate Limiting
Auth endpoints mają limit 20 req/min per IP.

---

## Quick Reference

### Start Backend (local profile)
```bash
cd first_aid_kit
./gradlew bootRun --args='--spring.profiles.active=local'
```

### Start Frontend
```bash
cd first_aid_kit_frontend
npm start
```

### API Base URL
- Local: `http://localhost:8082/api`
- Swagger UI: `http://localhost:8082/swagger-ui.html`

---

*Plan created: January 2026*
*Author: Claude Code*
