<script>
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'View Call Track Activities'

	import ViewActivities from '$lib/components/views/ViewActivities.svelte'
	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'

	$effect(() => {
		columnsState.alwaysHiddenColumns = []
	})

	let { data } = $props()
</script>

<ViewActivities key="calltrackActivities" {data} />
