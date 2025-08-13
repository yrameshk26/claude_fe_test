# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
TVUPWEB is a SvelteKit 5 full-stack business management platform with modules for billing, accounting, call tracking, wholesale operations, and management. It uses TypeScript, TailwindCSS, and connects to a GraphQL API backend.

## Essential Commands

### Development
```bash
npm run dev          # Start dev server on port 3000 (timezone: America/Toronto)
npm run build        # Lint and build for production
npm run preview      # Build and preview production build
npm run check        # Run Svelte type checking
npm run lint         # Run all linting (Prettier, ESLint, svelte-check)
npm run lint:fix     # Auto-fix linting issues
```

### WebSocket Server
```bash
cd ws-server && npm run dev  # Start WebSocket server for real-time features
```

### Docker Development
```bash
docker-compose up    # Start all services (app, Redis, WebSocket)
```

## High-Level Architecture

### Route Structure
The app uses nested layouts with authentication boundaries:
- `/(authenticated)/` - Main authenticated app containing:
  - `(accounting)` - Financial tracking and reports
  - `(billing)` - Customer and service management
  - `(calltrack)` - Phone number and call tracking
  - `(wholesale)` - Inventory and warranty management
  - `(management)` - User and settings management
  - `(reports)` - Cross-module reporting
- `/(public)/` - Login, forgot password, maintenance pages

### UI Component Systems

#### UI Design System
The project uses a modern dark theme with the following design principles:
- **Color Palette**: Slate colors (slate-800/50, slate-900, slate-950) for backgrounds
- **Typography**: White primary text, slate-400 for labels and secondary text
- **Borders**: Slate-700 borders that lighten to slate-500 on focus/hover
- **No Gradients**: Solid colors only for better readability and modern aesthetic
- **Input Styling**: All input components use consistent dark theme with:
  - Dark slate backgrounds (slate-800/50)
  - White text color for values
  - Slate-400 uppercase labels
  - Consistent focus states with slate-500 borders
  - Red accent colors for errors (red-500/50 borders, red-950/20 backgrounds)

#### shadcn/ui Components (New - Preferred)
The `/src/lib/components/ui/` directory contains modern UI components adapted from shadcn/ui:
- **Components**: Button, Input, Label, Card (with subcomponents), Alert
- **Styling**: Uses Tailwind CSS v4 with CSS variables for theming
- **Patterns**: 
  - Use `$props()` with destructuring for component props
  - Use `$derived()` for computed values
  - Use `@render children?.()` instead of slots
  - Full TypeScript support with proper type definitions
- **Utilities**: `cn()` function in `/src/lib/cn.ts` for class name merging

#### Legacy sveltewind Components
The `/src/sveltewind/` directory contains the original custom UI component library:
- Recently modernized with consistent dark theme styling
- Input components (TextInput, SelectInput, TextareaInput, etc.) updated with slate color scheme
- Form components (TextEditForm, SelectEditForm) updated for consistency
- Use for existing features that haven't been migrated to shadcn/ui yet
- Follow the established dark theme patterns when modifying these components

### Server-Side Logic
- Place server logic in `+page.server.ts` or `+layout.server.ts` files
- Use form actions for data mutations
- GraphQL queries/mutations go through the server-side layer

### Real-Time Features
- WebSocket server in `/ws-server/` handles real-time updates
- Chat system integrated with sidebar
- Inactivity monitoring for security

### Authentication Flow
1. GraphQL authentication via server-side hooks
2. Session cookies for state management
3. Redis for session storage
4. Permission-based access control per module

## Key Development Patterns

### Svelte 5 Runes
This project uses modern Svelte 5 with runes. Always use:
- `$state()` instead of `let` for reactive variables
- `$effect()` for side effects
- `$props()` for component props
- Snippets for reusable component parts

### Form Handling
Use SvelteKit's enhanced forms with progressive enhancement:
```svelte
<form method="POST" action="?/actionName" use:enhance>
```

### GraphQL Integration
All GraphQL calls must go through server-side functions. Never call the GraphQL endpoint directly from the client.

### TypeScript
The project uses TypeScript but with `noImplicitAny: false`. When adding new code:
- Always add proper type annotations
- Use interfaces for complex objects
- Avoid `any` types

## Environment Variables
Required for development:
```bash
GRAPHQL_ENDPOINT_URL=https://tvupweb-api-v2.azurewebsites.net
REDIS_URL=rediss://xxx:yyy@url:6379
```

## Important Notes
- No test framework is currently set up - do not assume tests exist
- The project uses America/Toronto timezone by default
- Husky pre-commit hooks will run linting automatically
- The WebSocket server is required for real-time features to work
- UI Components: Prefer shadcn/ui components in `/src/lib/components/ui/` for new features
- Check existing sveltewind components in `/src/sveltewind/` for legacy features