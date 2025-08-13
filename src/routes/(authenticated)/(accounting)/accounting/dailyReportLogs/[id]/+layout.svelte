<script>
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'

	import { page } from '$app/state'
	import { Tabs } from '$sveltewind/components/display'

	let { data, children } = $props()

	$effect(() => {
		headerState.title =
			'Daily Report Log ' + data.dailyReportLog?.transactionNo ||
			data.dailyReportLog?.refundReceiptNo ||
			data.dailyReportLog?.receivingPaymentNo
	})
</script>

<Tabs
	links={[
		{ label: 'General', href: `/accounting/dailyReportLogs/${page.params.id}` },
		{ label: 'Tickets', href: `/accounting/dailyReportLogs/${page.params.id}/tickets?status=OPEN` }
	]}
/>

<div class="h-[calc(100%-56px)] overflow-auto">
	{@render children()}
</div>
