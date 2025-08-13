<script>
	import ViewWarrantyClaims from '$lib/components/views/ViewWarrantyClaims.svelte'
	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'

	$effect(() => {
		columnsState.alwaysHiddenColumns = ['product']
	})

	let { data } = $props()
</script>

<ViewWarrantyClaims key="productWarrantyClaims" {data} />
