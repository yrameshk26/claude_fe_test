import type { Actions } from './$types'

import { dev } from '$app/environment'
import { fail, redirect } from '@sveltejs/kit'
import { graphqlFetchAction } from '$lib/utils'

export const actions = {
	default: async ({ request, fetch, cookies, url }) => {
		const formData = await request.formData()
		const ipapi = JSON.parse(formData.get('ipapi') as string) || {}
		const [result, errors] = await graphqlFetchAction({
			fetch,
			query: `
        mutation VALIDATE_OTP($id: String!, $otpHash: String!, $otp: String!, $fingerprint: String!, $city: String!, $country: String!, $postal: String!) {
					validateOTP(id: $id, otpHash: $otpHash, otp: $otp, fingerprint: $fingerprint, city: $city, country: $country, postal: $postal)
				}
      `,
			variables: {
				id: formData.get('id'),
				otpHash: formData.get('otpHash'),
				otp: formData.get('otp'),
				fingerprint: cookies.get('TVUPWEB_FINGERPRINT') as string,
				city: ipapi.city,
				country: ipapi.country_name,
				postal: ipapi.postal
			}
		})
		if (errors) {
			return fail(422, { errors })
		}

		// set session cookie
		cookies.set('TVUPWEB_AUTH_SESSION_ID', result.login.token, {
			path: '/',
			secure: !dev
		})

		// redirect to referrer or home page
		const referrer = url.searchParams.get('referrer') || '/'
		redirect(307, referrer)
	}
} satisfies Actions
