<script>
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'

	import { page } from '$app/state'
	import { Tabs } from '$sveltewind/components/display'

	let { data, children } = $props()

	$effect(() => {
		headerState.title = 'Product ' + data.product?.serialNo
	})
</script>

<Tabs
	links={[
		{ label: 'General', href: `/wholesale/products/${page.params.id}` },
		{ label: 'WarrantyClaims', href: `/wholesale/products/${page.params.id}/warrantyClaims` }
	]}
/>

<div class="h-[calc(100%-56px)] overflow-auto">
	{@render children()}
</div>
