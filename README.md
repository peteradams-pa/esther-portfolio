# Esther Watiri Kiarie — Premium Portfolio Platform

A world-class personal portfolio platform for Esther Watiri Kiarie, Technical Sales Manager · Solar Energy.

Built with Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Prisma, and PostgreSQL.

---

## 🗂️ Project Structure

```
esther-portfolio/
├── prisma/
│   ├── schema.prisma          # Full database schema
│   └── seed.ts                # Initial data seed
│
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Homepage
│   │   ├── about/page.tsx              # About page
│   │   ├── projects/
│   │   │   ├── page.tsx                # Projects listing
│   │   │   ├── ProjectsClient.tsx      # Filter/search logic (client)
│   │   │   └── [slug]/page.tsx         # Project detail page
│   │   ├── achievements/page.tsx       # Achievements page
│   │   ├── testimonials/page.tsx       # Testimonials page
│   │   ├── insights/page.tsx           # Blog/insights listing
│   │   ├── contact/
│   │   │   ├── page.tsx                # Contact page
│   │   │   └── ContactForm.tsx         # Validated form (client)
│   │   ├── admin/
│   │   │   ├── layout.tsx              # Admin layout (auth gated)
│   │   │   ├── login/page.tsx          # Admin login
│   │   │   ├── dashboard/page.tsx      # Dashboard with live stats
│   │   │   ├── projects/               # Project CRUD
│   │   │   │   ├── page.tsx
│   │   │   │   └── new/page.tsx
│   │   │   ├── blog/                   # Blog management
│   │   │   ├── testimonials/           # Testimonial management
│   │   │   ├── achievements/           # Achievement management
│   │   │   ├── profile/                # Profile editor
│   │   │   ├── inquiries/              # CRM / leads
│   │   │   └── seo/                    # SEO settings
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/     # NextAuth handler
│   │   │   ├── contact/route.ts        # Contact form + email
│   │   │   ├── projects/route.ts       # Projects CRUD API
│   │   │   ├── inquiries/[id]/route.ts # Inquiry status API
│   │   │   └── profile/route.ts        # Profile API
│   │   ├── sitemap.ts                  # Auto-generated sitemap
│   │   └── robots.ts                   # Robots config
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx              # Sticky nav with mobile menu
│   │   │   └── Footer.tsx              # Full footer
│   │   ├── ui/
│   │   │   ├── AnimatedCounter.tsx     # Scroll-triggered number counter
│   │   │   ├── RevealOnScroll.tsx      # Framer Motion reveal wrapper
│   │   │   └── ProjectCard.tsx         # Project listing card
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx         # Full hero with stats
│   │   │   └── SolarCalculator.tsx     # Interactive savings calculator
│   │   └── admin/
│   │       ├── AdminSidebar.tsx        # Admin nav sidebar
│   │       └── AdminTopbar.tsx         # Admin header bar
│   │
│   ├── lib/
│   │   ├── prisma.ts                   # Singleton Prisma client
│   │   ├── auth.ts                     # NextAuth configuration
│   │   ├── solar-calculator.ts         # Solar ROI calculation engine
│   │   ├── email.ts                    # Resend email service
│   │   └── utils.ts                    # Helpers, formatters, constants
│   │
│   └── types/
│       └── index.ts                    # All TypeScript types
│
├── .env.example                        # Environment variable template
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## ⚡ Quick Start (Local Development)

### 1. Install Dependencies

```bash
cd esther-portfolio
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in:
- `DATABASE_URL` — your PostgreSQL connection string
- `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`
- `RESEND_API_KEY` — get free at [resend.com](https://resend.com)
- All other values as needed

### 3. Set Up the Database

```bash
# Push schema to your database
npm run db:push

# Generate Prisma client
npm run db:generate

# Seed with initial data (Esther's profile, sample projects, etc.)
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin dashboard: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- Email: `esther@estherkiarie.com`
- Password: `Esther@Solar2025!` (change immediately after first login)

---

## 🚀 Deployment to Vercel (Recommended)

### Step 1 — Database

Choose one (all have free tiers):

**Option A: Vercel Postgres (easiest)**
```bash
# In your Vercel dashboard → Storage → Create Database → Postgres
# Copy the DATABASE_URL from the dashboard
```

**Option B: Supabase**
1. Go to [supabase.com](https://supabase.com) → New Project
2. Settings → Database → Copy connection string
3. Replace `[YOUR-PASSWORD]` in the URL

**Option C: Railway**
1. Go to [railway.app](https://railway.app) → New Project → PostgreSQL
2. Copy the `DATABASE_URL` from Variables tab

### Step 2 — Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts to link to your Vercel account
```

Or connect via GitHub:
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Framework: **Next.js** (auto-detected)

### Step 3 — Environment Variables in Vercel

In your Vercel project → Settings → Environment Variables, add:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Your PostgreSQL URL |
| `NEXTAUTH_URL` | `https://estherkiarie.com` |
| `NEXTAUTH_SECRET` | Generate: `openssl rand -base64 32` |
| `RESEND_API_KEY` | From resend.com |
| `EMAIL_FROM` | `noreply@estherkiarie.com` |
| `EMAIL_TO` | `esther@estherkiarie.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://estherkiarie.com` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `254700000000` |

### Step 4 — Run Migrations on Production

```bash
# After deploying, run the seed on production
vercel env pull .env.production.local
npx prisma db push --accept-data-loss
npx tsx prisma/seed.ts
```

### Step 5 — Custom Domain

In Vercel → Domains → Add `estherkiarie.com`
Update your DNS:
```
A record: @ → 76.76.21.21
CNAME: www → cname.vercel-dns.com
```

---

## 📧 Email Setup (Resend — Free)

1. Sign up at [resend.com](https://resend.com)
2. Add your domain and verify DNS records
3. Create an API key
4. Add `RESEND_API_KEY` to environment variables

Emails sent:
- **To Esther**: New inquiry notification with full details and reply link
- **To sender**: Professional auto-reply confirming receipt

---

## 🔐 Admin Dashboard

Access at `/admin/login`

**Default credentials (change after first login):**
- Email: `esther@estherkiarie.com`
- Password: `Esther@Solar2025!`

To change password, add a script or use Prisma Studio:
```bash
npm run db:studio
# Find the User table → update passwordHash
# Use bcrypt to hash: node -e "const b=require('bcryptjs');console.log(b.hashSync('NewPassword!',12))"
```

**Admin sections:**
| Section | What you can do |
|---|---|
| Dashboard | View stats, recent inquiries, top projects |
| Projects | Add, edit, publish/unpublish project case studies |
| Blog Posts | Write and publish solar insights articles |
| Testimonials | Add client testimonials with ratings |
| Achievements | Manage certifications, awards, speaking engagements |
| Profile | Update bio, contact details, hero statistics |
| Inquiries | View, respond, and track all contact form leads |
| SEO Settings | Edit meta titles and descriptions per page |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + custom design tokens |
| Animation | Framer Motion |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | NextAuth.js (JWT) |
| Email | Resend |
| Forms | React Hook Form + Zod |
| Hosting | Vercel |

---

## 🎨 Design System

**Typography:**
- Display / Headings: `Cormorant Garamond` (elegant serif)
- Body: `DM Sans` (clean modern sans)
- Code / Metrics: `Space Mono`

**Color Palette:**
```css
--sol-ink:   #0B1F3A   /* Deep navy — primary text & backgrounds */
--sol-deep:  #0D2D4D   /* Dark blue — hero/card backgrounds */
--sol-sky:   #1A5276   /* Solar blue — links, accents */
--sol-mid:   #2980B9   /* Mid blue */
--sol-leaf:  #1E8449   /* Emerald green — sustainability */
--sol-mint:  #27AE60   /* Fresh green — success, CTAs */
--sol-amber: #F39C12   /* Solar amber — primary accent */
--sol-gold:  #F1C40F   /* Solar gold — hover states */
--sol-ash:   #F4F6F9   /* Light background */
```

---

## 📊 Solar Calculator Logic

The calculator in `src/lib/solar-calculator.ts` uses:
- 80% system efficiency (standard derate factor)
- 6% annual grid tariff escalation (Kenya conservative estimate)
- 0.40 kg CO₂/kWh grid emission factor (Kenya grid)
- 25-year system lifetime for NPV calculation
- Iterative payback period with tariff escalation

---

## 🔄 Content Management

**Without code** — use the Admin Dashboard at `/admin`

**With code** — edit the seed file at `prisma/seed.ts` and re-run:
```bash
npm run db:seed
```

**Add a real CMS** — Sanity is pre-configured as an optional dependency. To activate:
1. Create a project at [sanity.io](https://sanity.io)
2. Add `NEXT_PUBLIC_SANITY_PROJECT_ID` to `.env.local`
3. Uncomment the Sanity client in `sanity/lib/client.ts`

---

## 🔧 Useful Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:studio    # Open Prisma Studio (database GUI)
npm run db:push      # Push schema changes (no migration history)
npm run db:migrate   # Run migrations (production-safe)
npm run db:seed      # Seed initial data
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Width |
|---|---|
| Mobile | < 640px |
| Tablet | 640px – 1024px |
| Desktop | > 1024px |

All pages are fully responsive. The admin dashboard sidebar is hidden on mobile.

---

Built with ☀️ for Esther Watiri Kiarie — Technical Sales Manager, Solar Energy · Nairobi, Kenya
