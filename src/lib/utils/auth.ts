import { env } from '$env/dynamic/private'

const getUserSession = async (token: string) => {
	return await fetch(env.GRAPHQL_ENDPOINT_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			cookie: `AUTH_SESSION_ID=${token}`,
			AUTH_SESSION_ID: token
		},
		body: JSON.stringify({
			query: `
        query GET_MY_PROFILE {
					getMyProfile
				}
      `
		}),
		signal: AbortSignal.timeout(5000)
	})
		.then((res) => res.json())
		.then((res) => {
			if (res.errors) {
				console.error(JSON.stringify(res.errors, null, 2))
				throw new Error(res.errors[0].message)
			} else if (!res.success && res.message) {
				throw new Error(res.message)
			} else if (res.data.getMyProfile) {
				return res.data.getMyProfile
			} else {
				throw new Error('No user found')
			}
		})
}

export default {
	getUserSession
}
