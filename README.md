# IUL Calculator Pro

A modern SaaS platform for Indexed Universal Life (IUL) insurance and 401(k) retirement plan comparisons. This application helps insurance agents and financial advisors create detailed client illustrations, compare retirement strategies, and manage their business operations.

## 🚀 Features

### Core Calculator Features
- **IUL vs 401(k) Comparison**: Side-by-side comparison of Indexed Universal Life insurance and traditional 401(k) retirement plans
- **Retirement Income Calculations**: Calculate gross retirement income, taxes, fees, and net income projections
- **Tax-Free Plan Analysis**: Extract and analyze tax-free plan data from uploaded illustrations
- **Multiple Calculators**:
  - Early Withdrawal Tax Calculator
  - Annual Contribution Calculator for IUL
  - Inflation Calculator
  - CAGR Chart (S&P Average vs Tax-Free Plan)
- **Dynamic Tab Management**: Customizable tab system for organizing client presentations
- **PDF Illustration Processing**: Extract data from PDF illustrations using advanced parsing

### User Management
- **Dual Authentication System**: Separate login paths for agents and administrators
- **Role-Based Access Control**: Admin and agent roles with different permissions
- **Session Management**: Track user sessions with device fingerprinting and history
- **Password Reset**: Secure password reset functionality via email tokens
- **User Profiles**: Manage company information, logos, and profile pictures

### File Management
- **Client File Management**: Upload, organize, and manage client illustration files
- **Drag & Drop Reordering**: Intuitive file organization with drag-and-drop
- **File Categories**: Separate "Pro Sample Files" (admin) and "Your Prospect Files" (user)
- **Data Persistence**: Save calculation parameters, tables, and results per file
- **Image Cropping**: Built-in image cropping for logos and profile pictures

### Subscription Management
- **Trial System**: 60-day free trial for new users
- **Subscription Plans**: Trial, Monthly, and Annual subscription options
- **Stripe Integration**: Payment processing via Stripe webhooks
- **Trial Extension**: Extend trials based on verified IUL sales
- **Subscription Status Tracking**: Real-time subscription status monitoring
- **Email Notifications**: Automated emails for trial activation, expiration, and subscription changes

### Admin Dashboard
- **Comprehensive Analytics**: Dashboard with charts and statistics
- **User Management**: View and manage all users
- **Resource Management**: 
  - Download Resources (PDFs, documents)
  - Training Documents
  - Training Videos
- **Insurance Company Management**: Add and manage insurance companies
- **Client File Oversight**: View all client files across the platform
- **Subscription Management**: Monitor and manage all subscriptions
- **Statistics Dashboard**: Track active users, files, subscriptions, and more

### Training & Resources
- **Training Content**: Access to training documents and videos
- **Download Resources**: Library of downloadable resources
- **Custom Tab Content**: Admins can add custom content tabs (images, videos, PDFs, links)
- **User-Specific Tab Ordering**: Users can customize tab order per file

### Additional Features
- **Progressive Web App (PWA)**: Installable web app with offline capabilities
- **Dark Mode Support**: Theme toggle for light/dark mode
- **Responsive Design**: Mobile-friendly interface
- **Email Integration**: Gmail OAuth2 for transactional emails
- **Zoho CRM Integration**: Sync leads and subscriptions to Zoho CRM
- **Vercel Blob Storage**: Cloud storage for files and images
- **Session History**: Track login/logout history with device information

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.5.7** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Component library
- **Framer Motion** - Animation library
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Zustand** - State management
- **Chart.js** - Data visualization
- **React DnD** - Drag and drop functionality
- **PDF.js** - PDF parsing and rendering

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **NextAuth.js 4.24.11** - Authentication
- **Prisma 6.10.1** - ORM
- **MongoDB** - Database
- **Stripe** - Payment processing
- **Nodemailer** - Email service
- **Google OAuth2** - Email authentication
- **Zoho API** - CRM integration

### Infrastructure
- **Vercel** - Hosting and deployment
- **Vercel Blob Storage** - File storage
- **MongoDB Atlas** - Cloud database
- **Vercel Analytics** - Analytics
- **Vercel Speed Insights** - Performance monitoring

## 📁 Project Structure

```
iul-calculator-pro-dev/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                     # Static assets
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/              # Admin routes
│   │   │   └── dashboard/      # Admin dashboard pages
│   │   ├── api/                # API routes
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   ├── files/          # File management
│   │   │   ├── subscribe/      # Subscription management
│   │   │   ├── stripe-webhook/ # Stripe webhooks
│   │   │   └── ...             # Other API endpoints
│   │   ├── dashboard/          # User dashboard routes
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # React components
│   │   ├── admin/              # Admin components
│   │   ├── auth/               # Authentication components
│   │   ├── calculator/         # Calculator components
│   │   ├── dashboard/          # Dashboard components
│   │   └── ui/                 # UI components (shadcn)
│   ├── context/                # React contexts
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility libraries
│   │   ├── auth.ts             # NextAuth configuration
│   │   ├── connect.ts          # Prisma client
│   │   ├── logics.ts           # Calculator logic
│   │   ├── nodemailer.ts       # Email configuration
│   │   ├── store.ts            # Zustand store
│   │   ├── types.ts            # TypeScript types
│   │   └── utils.ts            # Utility functions
│   ├── middleware.ts           # Next.js middleware
│   └── scripts/                # Utility scripts
└── package.json
```

## 🚦 Getting Started

### Prerequisites

- Node.js 20+ 
- npm, yarn, pnpm, or bun
- MongoDB database (local or MongoDB Atlas)
- Gmail account with OAuth2 setup (for emails)
- Stripe account (for payments)
- Vercel account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd iul-calculator-pro-dev
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI="your-mongodb-connection-string"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret"
   
   # Email (Gmail OAuth2)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   GOOGLE_REFRESH_TOKEN="your-google-refresh-token"
   SMTP_USER="your-email@gmail.com"
   ADMIN_EMAIL="admin@example.com"
   
   # Stripe
   STRIPE_SECRET_KEY="your-stripe-secret-key"
   STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
   
   # Vercel Blob Storage
   BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
   
   # Zoho CRM (Optional)
   ZOHO_CLIENT_ID="your-zoho-client-id"
   ZOHO_CLIENT_SECRET="your-zoho-client-secret"
   ZOHO_REFRESH_TOKEN="your-zoho-refresh-token"
   ZOHO_API_BASE_URL="https://www.zohoapis.com"
   ZOHO_AUTH_BASE_URL="https://accounts.zoho.com"
   ZOHO_REDIRECT_URI="http://localhost:3000/api/zoho/callback"
   
   # Application
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Environment Variables

### Required Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `NEXTAUTH_URL` | Base URL of your application |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js (generate with `openssl rand -base64 32`) |
| `GOOGLE_CLIENT_ID` | Google OAuth2 client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth2 client secret |
| `GOOGLE_REFRESH_TOKEN` | Google OAuth2 refresh token |
| `SMTP_USER` | Email address for sending emails |
| `ADMIN_EMAIL` | Admin email for notifications |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob Storage token |
| `NEXT_PUBLIC_APP_URL` | Public URL of your application |

### Optional Variables

| Variable | Description |
|----------|-------------|
| `ZOHO_CLIENT_ID` | Zoho CRM client ID |
| `ZOHO_CLIENT_SECRET` | Zoho CRM client secret |
| `ZOHO_REFRESH_TOKEN` | Zoho CRM refresh token |
| `ZOHO_API_BASE_URL` | Zoho API base URL |
| `ZOHO_AUTH_BASE_URL` | Zoho auth base URL |
| `ZOHO_REDIRECT_URI` | Zoho OAuth redirect URI |

## 🗄️ Database Schema

The application uses MongoDB with Prisma ORM. Key models include:

- **User**: User accounts with roles (admin/agent)
- **CompanyInfo**: Company information and branding
- **ClientFile**: Client illustration files and data
- **Subscription**: User subscription information
- **TrialToken**: Trial token management
- **Session**: NextAuth session management
- **SessionHistory**: Login/logout history tracking
- **TabContent**: Custom tab content for presentations
- **DownloadResources**: Downloadable resources
- **TrainingVideos**: Training video library
- **TrainingDocuments**: Training document library
- **InsuranceCompany**: Insurance company database
- **IULSale**: IUL sale tracking for trial extensions
- **EmailLog**: Email notification tracking
- **WebhookEvent**: Stripe webhook event deduplication

See `prisma/schema.prisma` for complete schema definitions.

## 📡 API Routes

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth endpoints
- `POST /api/auth/reset-password/request` - Request password reset
- `POST /api/auth/reset-password/[token]` - Reset password
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/sessionHistory` - Get session history

### Files
- `GET /api/files` - Get user's files
- `POST /api/files` - Create new file
- `GET /api/files/all` - Get all files (admin)
- `GET /api/files/[fileId]` - Get file by ID
- `PUT /api/files/[fileId]` - Update file
- `DELETE /api/files/[fileId]` - Delete file
- `POST /api/files/reorder` - Reorder files

### Subscriptions
- `GET /api/subscribe` - Get subscription status
- `POST /api/subscribe` - Create/update subscription
- `GET /api/subscriptions` - Get all subscriptions (admin)
- `POST /api/stripe-webhook` - Stripe webhook handler

### Admin
- `GET /api/users` - Get all users
- `GET /api/stats` - Get platform statistics
- `GET /api/download-resources` - Get download resources
- `GET /api/training-documents` - Get training documents
- `GET /api/training-videos` - Get training videos
- `GET /api/insurance-companies` - Get insurance companies
- `GET /api/tab-content` - Get tab content

### Other
- `GET /api/company-info` - Get company info
- `POST /api/company-info` - Update company info
- `GET /api/trial-status` - Get trial status
- `POST /api/trial-tokens` - Manage trial tokens
- `POST /api/contact-admin` - Contact admin form

## 🎯 Key Features Explained

### Calculator Logic

The application performs complex retirement planning calculations:

1. **Current Plan (401k)**: Calculates retirement income based on:
   - Starting balance
   - Annual contributions
   - Employer match
   - Return rate
   - Management fees
   - Tax rates (working vs retirement)
   - Retirement age
   - Years until money runs out

2. **Tax-Free Plan (IUL)**: Extracts data from uploaded PDF illustrations:
   - Premium outlay
   - Net income
   - Cash value
   - Death benefit
   - Charges/fees

3. **Comparison**: Side-by-side comparison showing:
   - Total advantage
   - Cumulative taxes paid
   - Cumulative fees paid
   - Cumulative net income
   - Death benefits

### File Processing

- PDF illustrations are parsed to extract table data
- Data is stored in MongoDB as JSON
- Calculations are performed client-side for real-time updates
- Results can be saved and loaded per file

### Subscription Flow

1. **Trial Activation**: New users get 60-day trial
2. **Trial Extension**: Trials can be extended with verified IUL sales
3. **Paid Subscription**: Users can upgrade to monthly/annual plans
4. **Stripe Integration**: Payments processed via Stripe Checkout
5. **Webhook Processing**: Subscription status updated via webhooks

## 🚀 Deployment

### Vercel Deployment

1. **Connect your repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Set up MongoDB Atlas** and add connection string
4. **Configure Stripe webhook** endpoint: `https://your-domain.com/api/stripe-webhook`
5. **Set up Vercel Cron Jobs** (optional):
   - `/api/cron/check-trial-expiration` - Daily at midnight
   - `/api/cron/send-trial-reminder` - Daily at midnight

### Build Commands

```bash
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### PWA Configuration

The app is configured as a Progressive Web App (PWA) with:
- Service worker for offline support
- Installable on mobile devices
- App manifest for app-like experience

## 🔧 Development

### Code Structure

- **Components**: Reusable React components in `src/components/`
- **Hooks**: Custom React hooks in `src/hooks/`
- **Lib**: Utility functions and configurations in `src/lib/`
- **API Routes**: Server-side API endpoints in `src/app/api/`
- **Types**: TypeScript type definitions in `src/lib/types.ts`

### State Management

- **Zustand**: Global state for calculator data (`src/lib/store.ts`)
- **React Context**: File context for file selection (`src/context/FileContext.tsx`)
- **React Hook Form**: Form state management
- **NextAuth**: Session management

### Styling

- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built component library
- **Framer Motion**: Animations and transitions
- **Dark Mode**: Theme toggle support

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run postinstall  # Generate Prisma client
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support, email [ADMIN_EMAIL] or contact through the admin contact form in the application.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- shadcn for the beautiful component library
- All contributors and users of the platform

---

**Built with ❤️ for insurance professionals**
