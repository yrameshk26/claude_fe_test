<script>
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'View Customer Tickets'

	import ViewTickets from '$lib/components/views/ViewTickets.svelte'
	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'

	$effect(() => {
		columnsState.alwaysHiddenColumns = ['dailyReportLog']
	})

	let { data } = $props()
</script>

<ViewTickets key="customerTickets" viewTicketPath="/billing/tickets" {data} />
