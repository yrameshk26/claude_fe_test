<script>
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	import { Sidebar } from '$sveltewind/components/layouts'

	import AppSwitcherMenu from '$lib/components/menu/AppSwitcherMenu.svelte'

	$effect(() => {
		headerState.class = 'bg-gradient-to-r from-indigo-900 to-blue-900'
	})

	let { children } = $props()
</script>

<Sidebar class="w-64 bg-gradient-to-b from-indigo-900 to-blue-900 text-white">
	<div class="flex h-full flex-col">
		<div class="flex w-full items-center justify-between gap-2 py-2.5">
			<h1 class="w-full pt-2 text-center text-xl font-semibold tracking-wider text-white">
				TVUPWEB
			</h1>
		</div>
		<AppSwitcherMenu isInline />
	</div>
</Sidebar>

<main class="h-[calc(100%)] p-4 transition-all">
	{@render children()}
</main>
