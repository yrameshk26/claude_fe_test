<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'View All Services'

	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'

	$effect(() => {
		columnsState.alwaysHiddenColumns = []
	})

	import ViewServices from '$lib/components/views/ViewServices.svelte'

	let { data } = $props()
</script>

<ViewServices key="allServices" {data} />
