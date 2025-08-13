<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'Receiving Payment Summary'

	import ViewDailyReportLogSummary from '$lib/components/views/ViewDailyReportLogSummary.svelte'

	let { data } = $props()
</script>

<ViewDailyReportLogSummary {data} type="RECEIVING_PAYMENT" />
