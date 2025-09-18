# My Portfolio & AI Chat

This is my personal portfolio website, built with Next.js, TypeScript, and Tailwind CSS. It features an AI-powered chat assistant that can answer questions about my experience and skills. The chat is powered by a Retrieval-Augmented Generation (RAG) system that uses my personal documents as a knowledge base.

## Features

- **AI-Powered Chat**: Interactive chat interface powered by OpenAI GPT models.
- **RAG (Retrieval-Augmented Generation)**: Context-aware responses based on my personal documents (resume, about me, etc.).
- **Rate Limiting**: Built-in protection against API abuse to ensure fair usage.
- **Responsive Design**: Modern and fully responsive UI with smooth animations, built with Tailwind CSS and ShadCN UI.
- **PostgreSQL with pgvector**: Efficiently stores and queries vector embeddings for the RAG system.

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [pgvector](https://github.com/pgvector/pgvector)
- **AI**: [OpenAI API](https://beta.openai.com/docs/)

## Getting Started

Follow these steps to get the project up and running on your local machine.

### 1. Prerequisites

- [Node.js](https://nodejs.org/en/)
- [pnpm](https://pnpm.io/)

### 2. Clone the Repository

```bash
git clone https://github.com/brOstro/portfolio
cd portfolio
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Set Up Environment Variables

Create a `.env` file in the root of the project and add the following environment variables.

```bash
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
RAG_CHAT_MODEL=gpt-5-nano
RAG_EMBED_MODEL=text-embedding-3-small

# Database
DATABASE_URL=your_postgres_connection_string
```

### 5. Run Database Migrations

This will create the necessary tables in your database.

```bash
pnpm run migrate:push
```

### 6. Ingest Data

This script will read your personal documents (in the `public/content` directory), generate embeddings using the OpenAI API, and store them in the database.

```bash
pnpm run ingest
```

### 7. Run the Development Server

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Scripts

- `pnpm dev`: Starts the development server.
- `pnpm build`: Creates a production build of the application.
- `pnpm start`: Starts the production server.
- `pnpm lint`: Lints the codebase using ESLint.
- `pnpm migrate:generate`: Generates a new database migration based on your schema changes.
- `pnpm migrate:push`: Pushes the latest migrations to your database.
- `pnpm ingest`: Ingests your personal documents into the database.
s deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.