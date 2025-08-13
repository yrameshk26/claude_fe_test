<script>
	import ViewTickets from '$lib/components/views/ViewTickets.svelte'
	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'

	$effect(() => {
		columnsState.alwaysHiddenColumns = ['customer', 'dailyReportLog']
	})

	let { data } = $props()
</script>

<ViewTickets key="customerTickets" viewTicketPath="/billing/tickets" {data} />
