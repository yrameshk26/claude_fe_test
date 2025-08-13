<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'View All Resellers'

	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'

	$effect(() => {
		columnsState.alwaysHiddenColumns = []
	})

	import ViewWholesalers from '$lib/components/views/ViewWholesalers.svelte'

	let { data } = $props()
</script>

<ViewWholesalers
	key="allResellers"
	model="Reseller"
	viewPath="/wholesale/resellers"
	{data}
	permissionType="RESELLER"
/>
