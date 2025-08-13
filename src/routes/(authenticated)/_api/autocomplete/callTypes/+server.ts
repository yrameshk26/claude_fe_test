import { json } from '@sveltejs/kit'

import type { RequestHandler } from './$types'

export const GET: RequestHandler = async () => {
	return json([
		{ label: `Inbound Direct Call`, value: `INBOUND_DIRECT_CALL` },
		{ label: `Outbound Direct Call`, value: `OUTBOUND_DIRECT_CALL` },
		{ label: `Callback Direct Line`, value: `CALLBACK_DIRECT_LINE` },
		{ label: `Inbound WhatsApp Video Call`, value: `INBOUND_WHATSAPP_VIDEO_CALL` },
		{ label: `Outbound WhatsApp Video Call`, value: `OUTBOUND_WHATSAPP_VIDEO_CALL` },
		{ label: `Inbound WhatsApp Audio Call`, value: `INBOUND_WHATSAPP_AUDIO_CALL` },
		{ label: `Outbound WhatsApp Audio Call`, value: `OUTBOUND_WHATSAPP_AUDIO_CALL` }
	])
}
