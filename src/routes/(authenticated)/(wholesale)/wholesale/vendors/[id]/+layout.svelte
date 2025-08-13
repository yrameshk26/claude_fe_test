<script>
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'

	import { Tabs } from '$sveltewind/components/display'
	import { page } from '$app/state'

	let { data, children } = $props()

	$effect(() => {
		headerState.title = 'Vendor ' + data.vendor?.name
	})
</script>

<Tabs
	links={[
		{ label: 'General', href: `/wholesale/vendors/${page.params.id}` },
		{ label: 'Products', href: `/wholesale/vendors/${page.params.id}/products` }
	]}
/>

<div class="h-[calc(100%-56px)] overflow-auto">
	{@render children()}
</div>
