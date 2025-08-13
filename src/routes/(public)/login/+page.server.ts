import type { Actions } from './$types'

import { dev } from '$app/environment'
import { fail, redirect } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'

export function load({ cookies }) {
	if (cookies.get('TVUPWEB_AUTH_SESSION_ID')) {
		// already logged in; redirect to home page
		redirect(307, '/')
	}
}

export const actions = {
	default: async ({ request, fetch, cookies, url }) => {
		const formData = await request.formData()
		const ipapi = JSON.parse(formData.get('ipapi') as string) || {}
		const [result, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation LOGIN($email: EmailAddress!, $password: String!, $fingerprint: String!, $city: String!, $country: String!, $postal: String!) {
					login(email: $email, password: $password, fingerprint: $fingerprint, city: $city, country: $country, postal: $postal)
				}
      `,
			variables: {
				email: formData.get('email'),
				password: formData.get('password'),
				fingerprint: cookies.get('TVUPWEB_FINGERPRINT') as string,
				city: ipapi.city || 'UNKNOWN',
				country: ipapi.country_name || 'UNKNOWN',
				postal: ipapi.postal || 'UNKNOWN'
			}
		})
		if (errors) {
			return fail(422, { errors })
		}

		const referrer = url.searchParams.get('referrer') || '/'

		// check if otp is required and redirect to otp page
		if (result.login.otpHash) {
			return redirect(
				307,
				`/login/otp?hash=${result.login.otpHash}&id=${result.login.id}&referrer=${referrer}`
			)
		}

		// set session cookie
		cookies.set('TVUPWEB_AUTH_SESSION_ID', result.login.token, {
			path: '/',
			secure: !dev
		})

		// redirect to referrer or home page
		redirect(307, referrer)
	}
} satisfies Actions
