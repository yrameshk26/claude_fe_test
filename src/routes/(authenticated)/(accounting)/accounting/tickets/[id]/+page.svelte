<script>
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'

	import { Tabs } from '$sveltewind/components/display'
	import ViewTicket from '$lib/components/views/ViewTicket.svelte'

	let { data } = $props()

	$effect(() => {
		headerState.title = 'Ticket ' + data.ticket?.subject?.name
	})
</script>

<Tabs />

<div class="h-[calc(100%-56px)] overflow-auto">
	<ViewTicket {data} />
</div>
