<script>
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'View All Tickets'

	import ViewTickets from '$lib/components/views/ViewTickets.svelte'
	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'

	$effect(() => {
		columnsState.alwaysHiddenColumns = []
	})

	let { data } = $props()
</script>

<ViewTickets key="allTickets" viewTicketPath="/tickets" {data} />
