import { redirect } from '@sveltejs/kit'
import { dev } from '$app/environment'

import { graphqlFetchAction } from '$lib/utils'

export async function load({ cookies, fetch, url }) {
	await graphqlFetchAction({
		fetch,
		query: `
        mutation LOGOUT {
          logout
        }
      `
	})

	cookies.set('TVUPWEB_AUTH_SESSION_ID', '', {
		expires: new Date(0),
		path: '/',
		secure: !dev
	})

	const referrer = url.searchParams.get('referrer') || '/'
	const error = url.searchParams.get('error') || ''

	redirect(302, `/login?referrer=${referrer}&error=${error}`)
}
