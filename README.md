# TVUPWEB - Client

## Description

Client application for all tvupweb related services.

## Tech Stack

- **Framework**: [SvelteKit 5](https://kit.svelte.dev/) with Svelte 5 runes
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) adapted for Svelte
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with CSS variables
- **Language**: TypeScript
- **State Management**: Svelte stores and runes
- **Backend**: GraphQL API
- **Session Storage**: Redis

## Development

The app is built using [sveltekit](https://kit.svelte.dev/)

### Environment

```bash
GRAPHQL_ENDPOINT_URL=https://tvupweb-api-v2.azurewebsites.net

REDIS_URL=rediss://xxx:yyy@url:6379
```

## Development

Use the docker-compose file to run the project locally and work with npm.

```bash
docker compose run --service-ports --rm app
npm run dev
```

The port 4000 is exposed by default and other dependent services are automatically started in background.

## Linting and Formatting

Husky is used to run linting and code formatting on commit for staged files. You can also run them manually:

```bash
npm run lint:fix
```

## UI Components

The application uses a hybrid approach for UI components:

### shadcn/ui Components
Modern, accessible components adapted from shadcn/ui for Svelte 5:
- Located in `/src/lib/components/ui/`
- Components: Button, Input, Label, Card, Alert
- Uses Tailwind CSS with CSS variables for theming
- Full TypeScript support with Svelte 5 runes

### Legacy sveltewind Components
Custom component library for existing features:
- Located in `/src/sveltewind/`
- Being progressively migrated to shadcn/ui

## Building the application

The application is built with the sveltekit [adapter-node](https://kit.svelte.dev/docs/adapter-node) adapter - which will generate a build folder with the compiled code.

```bash
npm run build
```

## Running a built docker image

A docker built image can be run using the following command. The image is built using the Dockerfile in the root of the project and uses the .env file for environment variables. Set the `PORT` environment variable to the port you want the app to run on.

```bash
docker compose run --rm build
```
