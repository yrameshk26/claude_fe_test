<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'Service Type Topups'

	import ViewServices from '$lib/components/views/ViewServices.svelte'
	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'

	$effect(() => {
		columnsState.alwaysHiddenColumns = ['createdDate', 'serviceType']
	})

	let { data } = $props()
</script>

<ViewServices key="todaysTopupServices" {data} />
