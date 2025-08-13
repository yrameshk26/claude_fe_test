import * as Sentry from '@sentry/sveltekit'
import { dev } from '$app/environment'
import { env } from '$env/dynamic/public'

Sentry.init({
	enabled: !dev && env.PUBLIC_SENTRY_DISABLED !== 'true',
	release: import.meta.env.BUILD_VERSION,
	dsn: 'https://2c0cb118318e38c6a198f7f5d7509ecf@o4508107557044224.ingest.us.sentry.io/4508107742707712',
	tracesSampleRate: 1.0,

	// This sets the sample rate to be 10%. You may want this to be 100% while
	// in development and sample at a lower rate in production
	replaysSessionSampleRate: 0.1,

	// If the entire session is not sampled, use the below sample rate to sample
	// sessions when an error occurs.
	replaysOnErrorSampleRate: 1.0,

	// If you don't want to use Session Replay, just remove the line below:
	integrations: [Sentry.replayIntegration()]
})

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = Sentry.handleErrorWithSentry()
