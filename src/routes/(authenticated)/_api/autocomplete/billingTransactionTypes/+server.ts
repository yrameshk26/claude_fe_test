import { json } from '@sveltejs/kit'

import type { RequestHandler } from './$types'

export const GET: RequestHandler = async () => {
	return json([
		{ label: `Sales`, value: `SALES` },
		{ label: `Invoice`, value: `INVOICE` },
		{ label: `Credit`, value: `CREDIT` },
		{ label: `Reverse`, value: `REVERSE` },
		{ label: `Referral`, value: `REFERRAL` },
		{ label: `Free`, value: `FREE` },
		{ label: `Trial`, value: `TRIAL` }
	])
}
