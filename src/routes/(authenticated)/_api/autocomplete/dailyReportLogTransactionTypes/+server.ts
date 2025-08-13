import { json } from '@sveltejs/kit'

import type { RequestHandler } from './$types'

export const GET: RequestHandler = async () => {
	return json([
		{ label: `Receiving Payment`, value: `RECEIVING_PAYMENT` },
		{ label: `Sales`, value: `SALES` },
		{ label: `Credit Memo`, value: `CREDIT_MEMO` }
	])
}
