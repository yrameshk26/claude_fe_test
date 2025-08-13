<script lang="ts">
	import ViewProducts from '$lib/components/views/ViewProducts.svelte'
	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'

	import { page } from '$app/state'

	$effect(() => {
		columnsState.alwaysHiddenColumns = ['vendor']
	})

	let { data } = $props()
</script>

<ViewProducts key="resellerProducts" {data} resellerID={page.params.id} />
