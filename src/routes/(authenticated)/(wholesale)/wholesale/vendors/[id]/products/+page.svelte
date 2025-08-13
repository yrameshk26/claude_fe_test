<script lang="ts">
	import ViewProducts from '$lib/components/views/ViewProducts.svelte'
	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'

	import { page } from '$app/state'

	$effect(() => {
		columnsState.alwaysHiddenColumns = ['reseller']
	})

	let { data } = $props()
</script>

<ViewProducts key="vendorProducts" {data} vendorID={page.params.id} />
