# MergeMe
A developer-focused dating platform where programmers can connect based on their
tech stack and job role, and shared interests. Submit your pull request!

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features
- **Tech Stack Matching**: Connect with developers who share your programming languages and frameworks
- **Smart Discovery**: Swipe-based interface to discover potential matches
- **Real-time Messaging**: Chat with your matches using real-time communication
- **Profile Customization**: Showcase your skills, job title, location, and bio
- **Mutual Matches**: See who you've matched with and start conversations

## Tech Stack

### Frontend
- **Next.js 15.5** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Utility-first CSS
- **HeroUI** - Modern UI components
- **Primer React Brand** - GitHub's design system components
- **Framer Motion** - Animations
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **TanStack Query** - Data fetching and caching

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **NextAuth.js** - Authentication
- **Prisma** - ORM and database toolkit
- **PostgreSQL** - Database
- **Pusher** - Real-time WebSocket communication
- **Cloudinary** - Image hosting and optimization
- **bcryptjs** - Password hashing

### Developer Tools
- **Biome** - Fast linter and formatter
- **Husky** - Git hooks
- **lint-staged** - Run linters on staged files
- **Turbopack** - Fast build tool

## Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **pnpm** 10.x or higher
- **PostgreSQL** database
- **Cloudinary** account
- **Pusher** account

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/ellyraad/merge-me.git
cd merge-me
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Required environment variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mergeme

# Default password for seeding (development only)
SEED_DATA_PW=your-seed-password

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_UPLOAD_PRESET=your-upload-preset

# Pusher
NEXT_PUBLIC_PUSHER_APP_KEY=your-app-key
PUSHER_APP_ID=your-app-id
PUSHER_APP_SECRET=your-app-secret
PUSHER_CLUSTER=your-cluster
NEXT_PUBLIC_PUSHER_CLUSTER=your-cluster

# NextAuth (auto-generated in development)
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

4. **Set up the database**

Run Prisma migrations to create database tables:

```bash
pnpm prisma migrate dev
```

5. **Seed the database** (optional)

Populate the database with sample data:

```bash
pnpm prisma db seed
```

6. **Run the development server**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
merge-me/
├── prisma/
│   ├── migrations/          # Database migrations
│   ├── schema.prisma        # Database schema
│   └── seed.ts             # Database seeding script
├── public/                 # Static assets
│   └── hero-bg.png        # Hero background image
├── src/
│   ├── app/
│   │   ├── (auth)/        # Authentication pages (login, register)
│   │   ├── (marketing)/   # Public marketing pages
│   │   ├── (social)/      # Protected app pages (discover, messages, etc.)
│   │   ├── actions/       # Server actions
│   │   ├── api/          # API routes
│   │   ├── contexts/     # React contexts
│   │   ├── onboarding/   # Onboarding flow
│   │   └── ui/           # UI components
│   ├── fonts/            # Custom fonts
│   ├── lib/              # Utilities and configurations
│   │   ├── hooks/       # Custom React hooks
│   │   ├── types/       # TypeScript types
│   │   └── schemas.ts   # Zod validation schemas
│   ├── services/         # Business logic layer
│   ├── auth.ts          # NextAuth configuration
│   └── middleware.ts    # Next.js middleware
├── .husky/              # Git hooks
├── biome.json          # Biome configuration
├── next.config.ts      # Next.js configuration
├── tailwind.config.ts  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## Available Scripts

```bash
# Development
pnpm dev              # Start development server with Turbopack
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run Biome linter
pnpm format           # Format code with Biome

# Database
pnpm prisma migrate dev    # Create and apply migrations
pnpm prisma db seed       # Seed the database
pnpm prisma studio        # Open Prisma Studio GUI
pnpm prisma generate      # Generate Prisma Client
```

## Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **User**: User profiles with bio, location, and photos
- **JobTitle**: Available job titles for users
- **ProgrammingLanguage**: Available programming languages
- **Swipe**: Like/pass interactions between users
- **Match**: Mutual likes between two users
- **Conversation**: Chat conversations between matches
- **Message**: Individual messages in conversations
- **Image**: User profile photos stored in Cloudinary

For the complete schema, see `prisma/schema.prisma`.

## Authentication

The app uses NextAuth.js with credentials-based authentication:

- Passwords are hashed using bcryptjs
- Session management with JWT tokens
- Protected routes via Next.js middleware
- Automatic redirect to login for unauthorized access

## Real-time Features

Real-time messaging is powered by Pusher:

- Instant message delivery
- Online status indicators
- Typing indicators (if implemented)
- Message read receipts

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure environment variables
4. Deploy

### Environment Variables for Production

Make sure to set all required environment variables in your deployment platform:

- Database URL (use a production PostgreSQL instance)
- Cloudinary credentials
- Pusher credentials
- NextAuth secret and URL

### Database Migrations

Run migrations in production:

```bash
pnpm prisma migrate deploy
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

