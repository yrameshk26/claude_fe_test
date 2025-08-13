<script>
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'

	import { Tabs } from '$sveltewind/components/display'

	let { data, children } = $props()

	$effect(() => {
		headerState.title = 'View Call Record ' + (data.callRecord?.customerPhoneNo || '')
	})
</script>

<Tabs />

<div class="h-[calc(100%-56px)] overflow-auto">
	{@render children()}
</div>
