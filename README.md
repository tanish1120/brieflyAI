# BrieflyAI Keywords

A modern note-taking application with AI-powered summarization and keyword extraction capabilities. Built with Next.js, Drizzle ORM, PostgreSQL, and Ollama for local AI processing.

## ✨ Features

- 📝 **Note Management** - Create, edit, and organize your notes
- 🤖 **AI Summarization** - Generate summaries in different lengths and styles
- 🔑 **Keyword Extraction** - Extract important keywords and key phrases
- 🔐 **User Authentication** - Secure user accounts with NextAuth
- 🎨 **Modern UI** - Beautiful interface built with Tailwind CSS and shadcn/ui
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🗄️ **PostgreSQL Database** - Robust data storage with Drizzle ORM
- 🚀 **Local AI** - Privacy-focused AI processing with Ollama

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js
- **AI**: Ollama with Phi-3 model
- **Deployment**: Docker for database

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Docker** - [Download here](https://docker.com/)
- **Ollama** - [Download here](https://ollama.ai/)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/tanish1120/brieflyAI
cd brieflyai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up PostgreSQL Database

Start PostgreSQL using Docker:

```bash
# Using Docker Compose (recommended)
docker compose up -d

# Or using Docker directly
docker run -d --name brieflyai-postgres \
  -e POSTGRES_DB=brieflyai \
  -e POSTGRES_USER=username \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  public.ecr.aws/docker/library/postgres:15
```

### 4. Set Up Database Schema

```bash
# Push the database schema
npm run db:push
```

### 5. Set Up Ollama AI

**Important**: Ollama must be running for AI summarization and keyword extraction features to work.

Install and start Ollama, then pull the required model:

```bash
# Install Ollama (if not already installed)
# Visit https://ollama.ai/ for installation instructions

# Start Ollama service (keep this running in background)
ollama serve

# In another terminal, pull the Phi-3 model
ollama pull phi3
```

**Note**: Without Ollama running, the summarization and keyword extraction features will not work, but you can still create and edit notes.

### 6. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/brieflyai"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

### 7. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### Creating Notes

1. Navigate to the dashboard
2. Click "New Note" or go to `/notes/new`
3. Enter a title and content
4. Click "Save" to create the note

### Generating Summaries

1. Open an existing note
2. In the right panel, select summary options:
   - **Length**: Short, Medium, or Long
   - **Style**: Bullet points or Paragraph
3. Click "Generate Summary"

### Extracting Keywords

1. Open an existing note
2. In the right panel, toggle to "Keywords" mode
3. Click "Extract Keywords"

## 🏗️ Project Structure

```
brieflyai-keywords-main/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication routes
│   │   │   ├── notes/         # Note CRUD operations
│   │   │   └── summarize/     # AI summarization routes
│   │   ├── dashboard/         # User dashboard
│   │   ├── login/             # Login page
│   │   ├── notes/             # Note pages
│   │   └── settings/          # User settings
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── auth/             # Authentication components
│   │   ├── layout/           # Layout components
│   │   └── notes/            # Note-specific components
│   ├── lib/                  # Utility libraries
│   │   ├── db/               # Database configuration
│   │   ├── api.ts            # API client functions
│   │   ├── auth.ts           # Authentication configuration
│   │   └── ollama.js         # Ollama AI integration
│   └── hooks/                # Custom React hooks
├── drizzle/                  # Database migrations
├── docker-compose.yml        # Docker Compose configuration
├── package.json             # Dependencies and scripts
└── tailwind.config.ts       # Tailwind CSS configuration
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate new migrations
npm run db:push      # Push schema changes to database
npm run db:migrate   # Run pending migrations
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `DELETE /api/auth/delete` - Delete account

### Notes
- `GET /api/notes` - Get all user notes
- `POST /api/notes` - Create new note
- `GET /api/notes/[id]` - Get specific note
- `PUT /api/notes/[id]` - Update note
- `DELETE /api/notes/[id]` - Delete note
- `GET /api/notes/search?q=query` - Search notes

### AI Summarization
- `POST /api/summarize` - Generate summary or extract keywords
- `GET /api/summarize/[noteId]` - Get summaries for a note
- `GET /api/usage` - Get user's usage statistics

## 🤖 AI Configuration

The application uses Ollama with the Phi-3 model for AI processing. The AI features include:

- **Summarization**: Generates concise summaries in different lengths and styles
- **Keyword Extraction**: Identifies important keywords and key phrases
- **Rate Limiting**: 10 summaries and 20 keyword extractions per day per user

### Customizing AI Prompts

AI prompts can be modified in `/src/lib/ollama.js`:

```javascript
const SUMMARY_PROMPT = `Summarize the following note in {length} length using {style}:

{content}

Summary:`;

const KEYWORDS_PROMPT = `Extract the most important keywords and key phrases from the following note. Return them as a bullet list:

{content}

Keywords:`;
```

## 🐳 Docker Commands

```bash
# Start database
docker compose up -d

# Stop database
docker compose down

# View database logs
docker compose logs postgres

# Access database directly
docker exec -it brieflyai-postgres psql -U username -d brieflyai
```

## 🔍 Troubleshooting

### Database Connection Issues

1. Ensure PostgreSQL container is running:
   ```bash
   docker ps | grep postgres
   ```

2. Check database logs:
   ```bash
   docker compose logs postgres
   ```

3. Verify connection string in `.env.local`

### Ollama Issues

1. Ensure Ollama is running:
   ```bash
   ollama serve
   ```

2. Check if Phi-3 model is downloaded:
   ```bash
   ollama list
   ```

3. Pull the model if missing:
   ```bash
   ollama pull phi3
   ```

### Build Issues

1. Clear Next.js cache:
   ```bash
   rm -rf .next
   npm run dev
   ```

2. Reinstall dependencies:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Port Conflicts

If port 3000 or 5432 is already in use, modify the ports in:
- `docker-compose.yml` for database port
- `.env.local` for NextAuth URL

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For questions or issues, please open an issue on GitHub or contact the development team.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
