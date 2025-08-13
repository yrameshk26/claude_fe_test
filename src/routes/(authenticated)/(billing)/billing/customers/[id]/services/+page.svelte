<script>
	import ViewServices from '$lib/components/views/ViewServices.svelte'
	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'

	import { page } from '$app/state'

	$effect(() => {
		columnsState.alwaysHiddenColumns = ['customer']
	})

	let { data } = $props()
</script>

<ViewServices key="customerServices" {data} customerID={page.params.id} />
