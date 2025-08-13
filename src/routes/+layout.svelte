<script lang="ts">
	import '../app.css'

	import { Dialog, Toast, PageLoadingSpinner } from '$sveltewind/components/display'
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'

	let { children } = $props()
</script>

<svelte:head>
	<title>
		{headerState.title || 'TVUPWEB'}
	</title>
</svelte:head>

<Toast />
<Dialog />

<PageLoadingSpinner />

{@render children()}
