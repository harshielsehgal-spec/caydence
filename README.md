# Cadence - Sports Coaching Platform

A comprehensive sports coaching platform connecting athletes with verified coaches across multiple sports disciplines including Football, Cricket, Basketball, Tennis, and Badminton.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Landing    │  │     Auth     │  │Sport Selection│         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
│  ┌─────────────────────────┐  ┌─────────────────────────┐    │
│  │    ATHLETE FEATURES     │  │     COACH FEATURES      │    │
│  │ • Dashboard             │  │ • Coach Home            │    │
│  │ • Coach Discovery       │  │ • Offers Management     │    │
│  │ • Video Analysis        │  │ • Calendar/Scheduling   │    │
│  │ • Session Booking       │  │ • Session Management    │    │
│  │ • AI Insights           │  │ • Masterclasses         │    │
│  │ • Reports & Progress    │  │ • Analytics/Revenue     │    │
│  │ • Skill Map             │  │ • Leaderboard           │    │
│  │ • Challenges            │  │ • Messages              │    │
│  └─────────────────────────┘  └─────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              SHARED FEATURES                            │  │
│  │  • Community  • Profile  • Marketplace                  │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      STATE MANAGEMENT LAYER                     │
│  ┌──────────────────┐  ┌──────────────────┐                   │
│  │  TanStack Query  │  │  React Hooks     │                   │
│  │  (Server State)  │  │  (Local State)   │                   │
│  └──────────────────┘  └──────────────────┘                   │
└─────────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND LAYER (Supabase)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  PostgreSQL  │  │  Supabase   │  │    Storage   │         │
│  │   Database   │  │    Auth     │  │   (Future)   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
│  Tables: user_roles, coaches, coach_availability, offers,      │
│          sessions, masterclasses, masterclass_enrollments,     │
│          coach_analytics                                        │
│                                                                 │
│  RLS Policies: Role-based access control                       │
│  Functions: has_role(), calculate_coach_leaderboard()          │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd cadence
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Environment variables**
   
   The `.env` file is auto-configured with Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://vmkunabmqtqslwrgitpu.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=<your-key>
   VITE_SUPABASE_PROJECT_ID=vmkunabmqtqslwrgitpu
   ```

4. **Run development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

5. **Access the application**
   
   Open [http://localhost:5173](http://localhost:5173) in your browser

## 📊 Database Schema

### Core Tables

#### `user_roles`
Manages dual-role system (athlete/coach)
```sql
- id: uuid (PK)
- user_id: uuid (FK → auth.users)
- role: app_role enum ('athlete', 'coach')
- created_at: timestamp
```

#### `coaches`
Coach profile information
```sql
- id: uuid (PK)
- user_id: uuid (FK → auth.users)
- name: text
- photo_url: text
- bio: text
- sports: text[] (array)
- cities: text[] (array)
- languages: text[] (array)
- mode: text[] (array: 'online', 'offline', 'hybrid')
- years_experience: integer
- per_session_fee: integer
- rating: numeric
- reviews_count: integer
- verified: boolean
- setup_complete: boolean
- created_at, updated_at: timestamp
```

#### `coach_availability`
Weekly recurring availability slots
```sql
- id: uuid (PK)
- coach_id: uuid (FK → coaches)
- weekday: integer (0-6)
- start_time: time
- end_time: time
- created_at, updated_at: timestamp
```

#### `offers`
Training packages created by coaches
```sql
- id: uuid (PK)
- coach_id: uuid (FK → coaches)
- title: text
- description: text
- sport: text
- level: text ('beginner', 'intermediate', 'advanced')
- mode: text[] (array)
- duration_min: integer
- price_inr: integer
- slots_per_week: integer
- includes_ai_check: boolean
- status: text ('draft', 'published')
- attachments: text[] (array)
- created_at, updated_at: timestamp
```

#### `sessions`
Booked training sessions
```sql
- id: uuid (PK)
- coach_id: uuid (FK → coaches)
- athlete_id: uuid (FK → auth.users)
- offer_id: uuid (FK → offers)
- start_time: timestamp
- end_time: timestamp
- mode: text
- status: text ('pending', 'confirmed', 'completed', 'cancelled')
- athlete_notes: text
- coach_decline_reason: text
- created_at, updated_at: timestamp
```

#### `masterclasses`
Group training sessions/courses
```sql
- id: uuid (PK)
- coach_id: uuid (FK → coaches)
- title: text
- description: text
- sport: text
- mode: text
- duration_min: integer
- price_inr: integer
- seats: integer
- enrolled_count: integer
- scheduled_at: timestamp
- video_url: text
- trailer_url: text
- tags: text[] (array)
- status: text ('draft', 'published', 'completed')
- rating: numeric
- created_at, updated_at: timestamp
```

#### `masterclass_enrollments`
Student enrollment tracking
```sql
- id: uuid (PK)
- masterclass_id: uuid (FK → masterclasses)
- athlete_id: uuid (FK → auth.users)
- payment_status: text ('pending', 'completed', 'failed')
- payment_amount: integer
- enrolled_at: timestamp
```

#### `coach_analytics`
Weekly aggregated analytics
```sql
- id: uuid (PK)
- coach_id: uuid (FK → coaches)
- sport: text
- week_start: date
- bookings_count: integer
- revenue_inr: integer
- masterclass_views: integer
- avg_form_score: numeric
- created_at: timestamp
```

### Database Functions

#### `has_role(user_id, role)`
Returns boolean indicating if user has specified role

#### `calculate_coach_leaderboard(sport_filter)`
Returns ranked coaches with scoring algorithm:
`score = (bookings * 10) + (rating * 20) + (masterclass_views * 5)`

### Row-Level Security (RLS)

All tables have RLS policies enforcing:
- Athletes can only view/modify their own data
- Coaches can only view/modify their own data
- Public data (published offers, masterclasses) viewable by all authenticated users
- Role-based access controlled via `has_role()` function

## 🔐 Authentication Flow

### Signup Process
1. User selects role (athlete or coach)
2. Provides email and password
3. Supabase creates auth user
4. Role inserted into `user_roles` table
5. Athletes → `/sport-selection`
6. Coaches → `/coach/onboarding`

### Login Process
1. User provides credentials
2. Supabase validates and creates session
3. Query `user_roles` to determine routing
4. Route to appropriate dashboard

### Role Switching
Users can have multiple roles (both athlete and coach)
- Managed via `AddRoleDialog` component
- Current role stored in `localStorage`
- `RoleSwitch` component toggles between roles

## 🎨 Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **TanStack React Query** - Server state management
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library
- **Lucide React** - Icon library
- **Recharts** - Data visualization

### Backend
- **Supabase** (via Lovable Cloud)
  - PostgreSQL database
  - Authentication (email/password)
  - Row-Level Security (RLS)
  - Realtime subscriptions (future)
  - Storage (future)

### Development Tools
- **ESLint** - Code linting
- **Zod** - Runtime validation
- **date-fns** - Date manipulation

## 📁 Project Structure

```
cadence/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── CoachCard.tsx   # Coach profile card
│   │   ├── SwipeCard.tsx   # Swipeable coach card
│   │   ├── CoachSidebar.tsx
│   │   ├── AthleteBottomNav.tsx
│   │   └── ...
│   ├── pages/              # Route components
│   │   ├── Landing.tsx
│   │   ├── Auth.tsx
│   │   ├── Dashboard.tsx
│   │   ├── CoachHome.tsx
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   │   ├── useUserRole.ts
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── integrations/       # External service integrations
│   │   └── supabase/
│   │       ├── client.ts   # Supabase client (auto-generated)
│   │       └── types.ts    # Database types (auto-generated)
│   ├── lib/
│   │   └── utils.ts        # Utility functions
│   ├── utils/
│   │   └── authCleanup.ts  # Auth cache cleanup utilities
│   ├── App.tsx             # Root component with routing
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles & design tokens
├── public/                 # Static assets
├── supabase/
│   ├── config.toml         # Supabase project config
│   └── migrations/         # Database migration files
├── .env                    # Environment variables (auto-configured)
├── tailwind.config.ts      # Tailwind configuration
├── vite.config.ts          # Vite configuration
├── package.json            # Dependencies
└── README.md              # This file
```

## 🎯 Key Features

### For Athletes
- **Coach Discovery** - Tinder-style swipe interface and marketplace browsing
- **AI Motion Analysis** - Upload videos for AI-powered form analysis
- **Performance Tracking** - Progress reports, skill maps, training analytics
- **Session Booking** - Book 1-on-1 or group training sessions
- **Masterclass Access** - Enroll in coach-led masterclasses
- **Challenges** - Participate in training challenges and competitions
- **Community** - Connect with other athletes and share progress

### For Coaches
- **Profile Management** - Comprehensive onboarding and profile setup
- **Offer Creation** - Create and manage training packages
- **Scheduling** - Calendar view with availability management
- **Session Management** - Accept/decline/manage bookings
- **Masterclass Platform** - Host group training sessions
- **Analytics Dashboard** - Revenue, bookings, performance metrics
- **Leaderboard** - Compete with other coaches in rankings
- **Messaging** - Communicate with athletes

### Cross-Platform
- **Dual-Role System** - Users can be both athlete and coach
- **Multi-Sport Support** - Football, Cricket, Basketball, Tennis, Badminton
- **Responsive Design** - Mobile-first responsive UI
- **Real-time Updates** - Live session status and notifications

## 🔧 Build & Deploy

### Build for Production

```bash
npm run build
# or
bun run build
```

Output directory: `dist/`

### Preview Production Build

```bash
npm run preview
# or
bun run preview
```

### Deploy

This project is deployed via **Lovable** platform:

1. **Frontend Deployment**
   - Click "Publish" button in Lovable editor (top-right on desktop)
   - Frontend changes require clicking "Update" in publish dialog
   - Accessible at: `<project-name>.lovable.app`

2. **Backend Deployment**
   - Database migrations deploy automatically
   - Edge functions deploy automatically
   - No manual deployment needed for backend changes

3. **Custom Domain** (Paid plans only)
   - Navigate to Project > Settings > Domains in Lovable
   - Add your custom domain
   - Follow DNS configuration instructions

### Environment Variables

Frontend environment variables (prefixed with `VITE_`):
- Automatically configured via `.env` file
- Loaded by Vite at build time
- Accessible via `import.meta.env.VITE_*`

Backend secrets (managed via Lovable Cloud):
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DB_URL`

## 🧪 Development Utilities

### Dev Cleanup Tool
Access at `/dev-cleanup` (dev only)
- Clear localStorage
- Clear sessionStorage  
- Delete IndexedDB databases
- Sign out and clear all auth caches
- SQL snippets for orphaned record cleanup

### Auth Cache Management
```typescript
import { clearAllAuthCaches, signOutAndClearAll } from '@/utils/authCleanup';

// Clear all auth caches
await clearAllAuthCaches();

// Sign out and clear everything
await signOutAndClearAll(supabase);
```

## 📝 Code Conventions

### Component Structure
- Functional components with TypeScript
- Props interfaces defined inline or exported
- Use shadcn/ui components for consistency
- Semantic color tokens from design system (no direct colors)

### Styling
- **Primary method**: Tailwind utility classes
- **Design tokens**: Use CSS variables from `index.css`
- **Semantic colors**: `background`, `foreground`, `primary`, `secondary`, etc.
- **No direct colors**: Avoid `text-white`, `bg-blue-500`, etc.
- **Responsive**: Mobile-first approach

### State Management
- **Server state**: TanStack Query (`useQuery`, `useMutation`)
- **Local state**: React hooks (`useState`, `useReducer`)
- **Auth state**: Supabase `onAuthStateChange` listener
- **Form state**: React Hook Form with Zod validation

### Database Queries
```typescript
import { supabase } from '@/integrations/supabase/client';

// Query with RLS
const { data, error } = await supabase
  .from('coaches')
  .select('*')
  .eq('sport', 'Football');

// RPC function call
const { data, error } = await supabase
  .rpc('calculate_coach_leaderboard', { sport_filter: 'Football' });
```

## 🐛 Troubleshooting

### Common Issues

**Issue**: "Session expired" errors
- **Solution**: Run dev cleanup tool at `/dev-cleanup`

**Issue**: Database permissions error
- **Solution**: Check RLS policies, ensure user has correct role in `user_roles`

**Issue**: Styles not applying
- **Solution**: Use semantic tokens from design system, check `index.css` and `tailwind.config.ts`

**Issue**: Route not found
- **Solution**: Verify route is defined in `src/App.tsx` Routes

**Issue**: Build fails
- **Solution**: Check TypeScript errors, ensure all imports are correct

## 🔗 Useful Links

- [Lovable Documentation](https://docs.lovable.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Router Documentation](https://reactrouter.com/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 📄 License

[Add your license here]

## 🤝 Contributing

[Add contribution guidelines here]

## 📧 Support

For issues and questions:
- Check documentation links above
- Review troubleshooting section
- Contact project maintainers

---

**Built with ❤️ using Lovable**
