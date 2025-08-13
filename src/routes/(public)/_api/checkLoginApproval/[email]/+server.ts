import { graphqlFetchAction } from '$lib/utils'
import { json, redirect } from '@sveltejs/kit'
import { dev } from '$app/environment'

import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ url, params, fetch, locals, request, cookies }) => {
	const { ipapi } = await request.json()
	try {
		const [data, errors] = await graphqlFetchAction({
			fetch,
			query: `
      mutation CHECK_LOGIN_APPROVAL($email: EmailAddress!, $fingerprint: String!, $city: String!, $country: String!, $postal: String!) {
        loginApprovalChecker(email: $email, fingerprint: $fingerprint, city: $city, country: $country, postal: $postal)
      }
    `,
			variables: {
				email: params.email,
				fingerprint: locals.session.cookies['TVUPWEB_FINGERPRINT'],
				city: ipapi.city || 'UNKNOWN',
				country: ipapi.country_name || 'UNKNOWN',
				postal: ipapi.postal || 'UNKNOWN'
			}
		})

		if (errors) {
			return json({ errors })
		}

		const referrer = url.searchParams.get('referrer') || '/'

		// check if otp is required and redirect to otp page
		if (data.loginApprovalChecker.otpHash) {
			return redirect(
				307,
				`/login/otp?hash=${data.loginApprovalChecker.otpHash}&id=${data.loginApprovalChecker.id}&referrer=${referrer}`
			)
		}

		if (data.loginApprovalChecker.token) {
			// set session cookie
			cookies.set('TVUPWEB_AUTH_SESSION_ID', data.loginApprovalChecker.token, {
				path: '/',
				secure: !dev
			})
		}

		return json({
			success: data.loginApprovalChecker,
			referrer
		})
	} catch (error) {
		if (error instanceof Error) {
			return json({ errors: [error.message] })
		} else {
			return json({ errors: ['An unknown error occurred'] })
		}
	}
}
