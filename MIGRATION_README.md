# BrieflyAI Keywords - Migration to Drizzle

## Migration Complete ✅

The project has been successfully migrated from Prisma to Drizzle ORM. All API routes, authentication, and database operations have been updated.

## Database Setup

Since Docker authentication is having issues, here are the options to set up PostgreSQL:

### Option 1: Install PostgreSQL locally (macOS)
```bash
brew install postgresql
brew services start postgresql
createdb brieflyai
psql brieflyai
```

### Option 2: Use Docker with different approach
```bash
# Try logging into Docker first
docker login

# Or use a different registry
docker pull postgres:15
docker run -d --name brieflyai-postgres -e POSTGRES_DB=brieflyai -e POSTGRES_USER=username -e POSTGRES_PASSWORD=password -p 5432:5432 postgres:15
```

### Option 3: Use a cloud database
Update the `DATABASE_URL` in `.env.local` to point to a cloud PostgreSQL instance.

## Running the Application

1. Install dependencies:
```bash
npm install
```

2. Generate and push database schema:
```bash
npm run db:push
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:3000

## Key Changes Made

- Replaced Prisma with Drizzle ORM
- Updated all API routes to use Drizzle queries
- Converted Prisma schema to Drizzle schema
- Updated authentication to work with Drizzle
- Added Drizzle migration scripts

## Database Schema

The database includes three tables:
- `users`: User accounts
- `notes`: User notes
- `summaries`: AI-generated summaries and keywords

All foreign key relationships and constraints are maintained.