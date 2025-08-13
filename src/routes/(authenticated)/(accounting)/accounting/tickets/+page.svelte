<script>
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'View Daily Report Log Tickets'

	import ViewTickets from '$lib/components/views/ViewTickets.svelte'
	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'

	$effect(() => {
		columnsState.alwaysHiddenColumns = ['customer']
	})

	let { data } = $props()
</script>

<ViewTickets key="dailyReportLogTickets" viewTicketPath="/accounting/tickets" {data} />
