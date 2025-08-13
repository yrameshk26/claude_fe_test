import loadCallRecords from '$lib/server/loadCallRecords'

export async function load({ fetch, locals, url }) {
	return loadCallRecords({
		fetch,
		url,
		locals
	})
}
