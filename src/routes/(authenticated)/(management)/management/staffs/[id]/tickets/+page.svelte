<script>
	import ViewTickets from '$lib/components/views/ViewTickets.svelte'
	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'

	$effect(() => {
		columnsState.alwaysHiddenColumns = ['user', 'dailyReportLog', 'customer']
	})

	let { data } = $props()
</script>

<ViewTickets key="userTickets" viewTicketPath="/management/staffTickets" {data} />
