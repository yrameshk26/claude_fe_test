import * as Sentry from '@sentry/sveltekit'
import { sequence } from '@sveltejs/kit/hooks'
import { dev } from '$app/environment'
import { env } from '$env/dynamic/public'

import maintenanceModeHandle from './_maintenanceModeHandle'
import lastActiveHandle from './_lastActiveHandle.server'
import fingerprintHandle from './_fingerprintHandle.server'
import authHandle from './_authHandle.server'
import activeStoreHandle from './_activeStoreHandle.server'
import cookiesHandle from './_cookiesHandle.server'
import fetchHandle from './_fetchHandle.server'
import errorHandle from './_errorHandle.server'

Sentry.init({
	enabled: !dev && env.PUBLIC_SENTRY_DISABLED !== 'true',
	release: import.meta.env.BUILD_VERSION,
	dsn: 'https://2c0cb118318e38c6a198f7f5d7509ecf@o4508107557044224.ingest.us.sentry.io/4508107742707712',
	tracesSampleRate: 1.0
})

export const handleFetch = fetchHandle

// If you have custom handlers, make sure to place them after `sentryHandle()` in the `sequence` function.
export const handle = sequence(
	Sentry.sentryHandle(),
	maintenanceModeHandle,
	authHandle,
	lastActiveHandle,
	fingerprintHandle,
	activeStoreHandle,
	cookiesHandle
)

export const handleError = errorHandle
