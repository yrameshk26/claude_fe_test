<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'View All Vendors'

	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'

	$effect(() => {
		columnsState.alwaysHiddenColumns = []
	})

	import ViewWholesalers from '$lib/components/views/ViewWholesalers.svelte'

	let { data } = $props()
</script>

<ViewWholesalers
	key="allVendors"
	model="Vendor"
	viewPath="/wholesale/vendors"
	{data}
	permissionType="VENDOR"
/>
