<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'Total Summary'

	import ViewDailyReportLogSummary from '$lib/components/views/ViewDailyReportLogSummary.svelte'

	let { data } = $props()
</script>

<ViewDailyReportLogSummary {data} />
