<script>
	import ViewTransactions from '$lib/components/views/ViewTransactions.svelte'
	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'

	$effect(() => {
		columnsState.alwaysHiddenColumns = ['customer']
	})

	let { data } = $props()
</script>

<ViewTransactions key="customerTransactions" {data} />
