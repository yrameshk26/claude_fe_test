<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'View All Products'

	import ViewProducts from '$lib/components/views/ViewProducts.svelte'
	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'

	$effect(() => {
		columnsState.alwaysHiddenColumns = []
	})

	let { data } = $props()
</script>

<ViewProducts key="allProducts" {data} />
