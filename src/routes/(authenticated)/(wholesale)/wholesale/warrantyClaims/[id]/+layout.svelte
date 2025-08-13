<script>
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'

	import { Tabs } from '$sveltewind/components/display'

	let { data, children } = $props()

	$effect(() => {
		headerState.title = 'Warranty Claim for ' + data.warrantyClaim?.product?.serialNo
	})
</script>

<Tabs />

<div class="h-[calc(100%-56px)] overflow-auto">
	{@render children()}
</div>
