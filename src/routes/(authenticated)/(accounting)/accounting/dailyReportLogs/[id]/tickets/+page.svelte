<script>
	import ViewTickets from '$lib/components/views/ViewTickets.svelte'
	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'

	$effect(() => {
		columnsState.alwaysHiddenColumns = ['dailyReportLog', 'customer']
	})

	let { data } = $props()
</script>

<ViewTickets key="dailyReportLogTickets" viewTicketPath="/accounting/tickets" {data} />
