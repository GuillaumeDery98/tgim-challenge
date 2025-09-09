# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev`
- **Build**: `npm run build`  
- **Lint and typecheck**: `npm run lint`
- **Preview build**: `npm run preview`

## Project Architecture

This is a React TypeScript application built with Vite featuring a TGIM (Intelligence Artificielle) challenge system with 2 specialized AI agents. The project uses a modular architecture organized around business domains and includes advanced AI integrations with OpenPipe for multi-model support.

### Core Technologies
- **Frontend**: React 19, TypeScript, Vite
- **UI Framework**: Radix UI components with Tailwind CSS (shadcn/ui style)
- **State Management**: TanStack Query for server state and optimistic updates
- **AI Integration**: OpenPipe client (OpenAI-compatible) for multi-model support
- **Authentication**: Custom auth system with mock Supabase client
- **Routing**: React Router v6 with protected routes
- **Styling**: Tailwind CSS with CSS variables for theming

### Module Structure
The `src/modules/` directory contains feature modules:
- `auth/` - Authentication with login/register/reset password
- `dashboard/` - Main dashboard interface
- `chatbot/` - TGIM AI chatbot functionality
- `ma/` - M&A related features (deals, valuator, negotiator AI, chatbot TGIM)
- `email/` - Email system (admin only)
- `user/` - User profile management
- `settings/` - Application settings
- `layout/` - Layout components and navigation
- `theme/` - Theme management
- `notifications/` - Toast notifications
- `storage/` - File storage services

Each module follows the pattern:
```
module-name/
├── components/     # React components
├── hooks/         # Custom React hooks
├── types/         # TypeScript interfaces
├── services/      # API/business logic
└── data/          # Static data/constants
```

### Key Configuration
- **Path Aliases**: `@/` maps to `src/`
- **TypeScript**: Project/node split configuration
- **Build Optimization**: Manual chunk splitting for vendors
- **Auth System**: Role-based access (admin, negotiator, user)

### UI Components
Located in `src/components/ui/` following shadcn/ui conventions with:
- Radix UI primitives
- Tailwind CSS styling  
- Class variance authority for variants
- Error boundaries for fault tolerance

### Mock Backend
Uses a mock Supabase client (`src/lib/supabase.ts`) for development, providing auth and data operations without external dependencies.

### TGIM AI Challenge Features
The project includes 2 specialized AI agents with OpenPipe integration:

1. **Negotiation AI Agent** (`/negotiator-ai`)
   - M&A negotiation assistance with contextual strategies
   - Real-time chat interface with performance metrics
   - Mock negotiation scenarios with TechFlow Solutions case study
   - Service: `NegotiationAIService` with OpenPipe client

2. **TGIM Knowledge Chatbot** (`/tgim-chatbot`) 
   - RAG (Retrieval Augmented Generation) system
   - Knowledge base with TGIM guides, formations, templates
   - Source citations and semantic search capabilities  
   - Service: `TGIMChatbotService` with mock vector database

### AI Integration
- **OpenPipe Configuration**: Multi-model support (GPT-4, Claude, Gemini, fine-tuned models)
- **Development Mode**: Full offline functionality with intelligent mock responses
- **Environment Variables**: `.env.example` provided for OpenPipe setup
- **TanStack Query**: Optimistic updates and real-time mutations for AI interactions