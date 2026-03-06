# RutgersPlan

A web-based course planning tool for Rutgers University students. Build optimized 4-year graduation plans with smart course suggestions, professor ratings, and community college transfer recommendations.

## Features

- **4-Year Planner** - Drag & drop semester view to plan your courses
- **Course Catalog** - Browse Rutgers courses with filters by semester, credits, and type
- **Easy A Finder** - Discover GPA-boosting course alternatives
- **Professor Ratings** - View professor ratings from RateMyProfessors
- **CC Transfer Suggester** - Find community college equivalents to save money
- **Requirement Tracker** - Track your progress through SAS Core, Major, and Elective requirements
- **Credit Counter** - Running total of credits per semester

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Auth | Supabase Auth |
| Database | Supabase (Postgres) |
| Backend | Supabase Edge Functions |
| Payments | Stripe |
| Deployment | Vercel |

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account (for payments - not required for MVP)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd ru-on-track
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key  # Optional
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/
│   ├── layout/          # Navbar, Sidebar
│   ├── planner/         # SemesterCard, CourseChip, RequirementBar
│   ├── professor/       # ProfCard, ProfNotFound
│   └── shared/         # PremiumGate, Modal
├── hooks/
│   ├── useAuth.js      # Authentication logic
│   ├── usePlanner.js   # Plan management
│   └── useCourses.js   # Course data fetching
├── lib/
│   ├── supabase.js     # Supabase client
│   ├── stripe.js       # Stripe integration
│   └── rmp.js         # RateMyProfessors utilities
├── pages/
│   ├── Landing.jsx     # Landing page
│   ├── Auth.jsx        # Sign in / Sign up
│   ├── Onboarding.jsx  # Initial setup wizard
│   ├── Dashboard.jsx   # Main dashboard
│   ├── Planner.jsx     # Course planner
│   ├── EasyA.jsx       # Easy A courses
│   ├── Professors.jsx  # Professor ratings
│   └── Settings.jsx   # User settings
└── data/
    ├── rutgers-courses.json
    ├── easy-a-swaps.json
    └── cc-transfers.json
```

## Database Schema

The application uses the following main tables:

- **profiles** - User profile data (major, grad year, preferences)
- **courses** - Course catalog
- **plans** - User's 4-year plans
- **plan_courses** - Courses in each plan
- **course_swaps** - Easy A alternatives
- **cc_equivalencies** - Community college transfer equivalencies

See [CLAUDE.md](./CLAUDE.md) for the complete database schema and RLS policies.

## Premium Features

| Feature | Free | Premium |
|---|---|---|
| 4-year planner | ✅ | ✅ |
| Course catalog | ✅ | ✅ |
| Requirement tracker | ✅ | ✅ |
| Easy A finder | ❌ | ✅ |
| Alt course swaps | ❌ | ✅ |
| CC transfer suggestions | ❌ | ✅ |
| Professor ratings | ❌ | ✅ |
| Export to PDF | ❌ | ✅ |
| Shareable plan link | ❌ | ✅ |

## Legal

- Professor ratings are sourced from RateMyProfessors. Data may be outdated or inaccurate.
- Transfer credit acceptance is subject to Rutgers approval. Verify with your academic advisor before enrolling.
- This project is not affiliated with Rutgers University.

## License

MIT

---

Built for Rutgers students, by a Rutgers student.
