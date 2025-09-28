# Frontend RAG Chat Agent

A small, modern React + Next.js frontend for a retrieval-augmented generation (RAG) chat agent. The app demonstrates a chat UI that integrates local/remote knowledge sources and AI models to provide context-aware responses, message artifacts, inline citations, and developer-oriented UI components.

## What this project is

This repository contains a Next.js application (App Router) that implements a chat interface built with React and Tailwind CSS. It’s designed as a frontend demo for RAG-style chat agents and includes a collection of composable UI primitives and AI-specific elements (message cards, context blocks, tool outputs, code blocks, image previews, etc.).

Key goals:

- Provide a polished chat UI for exploring retrieval-augmented chat flows

- Show how to compose AI responses with structured artifacts (sources, citations, suggestions)

- Demonstrate integration patterns for streaming/real-time AI responses

## Features

- Modern Next.js app (App Router)
- Rich chat UI components and AI-focused elements
- Message streaming and processing modes
- Theme support (light/dark)
- Accessible UI primitives using Radix UI
- Syntax highlighted code blocks and image previews

## Technologies

Primary technologies used in this project (extracted from `package.json`):

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Radix UI (avatar, dialog, dropdowns, tooltip, scroll area, etc.)
- AI packages: `ai` and `@ai-sdk/react` for model/assistant integrations
- Axios for HTTP requests
- lucide-react for icons
- react-syntax-highlighter for code blocks
- Embla carousel for media carousels
- Utility libraries: `clsx`, `nanoid`, `tokenlens`, `class-variance-authority`, `tailwind-merge`

Dev tooling:

- ESLint
- TypeScript types for React & Node

## Repository structure

- `src/app` — Next.js app entry, pages and global styles
- `src/components` — UI primitives, chat components, and AI elements
- `src/hooks` — custom React hooks (e.g. `useChat`)
- `src/lib` — utility functions

## Quick start

1. Install dependencies (this project uses pnpm in the repo):

```bash
pnpm install
```

1. Start the development server:

```bash
pnpm dev
```

1. Open your browser to `http://localhost:3000`.

Notes:

- Environment variables or backend endpoints for the AI model may be required depending on how the project is wired (not included here). Check `src` files for any references to API keys or backend routes.

- Build for production with `pnpm build` and run with `pnpm start`.

## Backend

This frontend is designed to work with a companion backend that handles PDF ingestion, embeddings, and AI model requests. A recommended backend repository is:

-`https://github.com/Gopendranath/Rag-pdf-chat-backend`

To integrate:

- Check the backend README for environment variables and API endpoints.
- Point the frontend's API calls (if any) to the backend server URL (for development, usually `http://localhost:PORT`).
- Ensure CORS and any API keys are configured on the backend.

## Contributing

Contributions are welcome. Open issues or PRs to add features, fix bugs, or improve docs.

## License

This project doesn't include a license file. Add one (for example, MIT) if you want to allow reuse.
