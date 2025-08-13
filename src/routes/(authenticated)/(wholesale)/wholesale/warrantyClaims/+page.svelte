<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'View All WarrantyClaims'
	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'

	import ViewWarrantyClaims from '$lib/components/views/ViewWarrantyClaims.svelte'

	$effect(() => {
		columnsState.alwaysHiddenColumns = []
	})

	let { data } = $props()
</script>

<ViewWarrantyClaims key="allWarrantyClaims" {data} />
