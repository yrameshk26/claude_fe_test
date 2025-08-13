<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'View All Transactions'

	import ViewTransactions from '$lib/components/views/ViewTransactions.svelte'

	let { data } = $props()
</script>

<ViewTransactions key="allTransactions" {data} />
