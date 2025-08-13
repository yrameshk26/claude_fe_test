<script>
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	import { Sidebar } from '$sveltewind/components/layouts'
	import Badge from '$lib/components/ui/badge.svelte'
	import AppSwitcherMenu from '$lib/components/menu/AppSwitcherMenu.svelte'

	$effect(() => {
		headerState.class = 'bg-slate-900 border-b border-slate-800'
	})

	let { children } = $props()
</script>

<Sidebar class="w-64 bg-slate-900 text-white border-r border-slate-800">
	<div class="flex h-full flex-col">
		<div class="flex w-full flex-col items-center justify-between py-4">
			<div class="w-20 h-20 bg-slate-900/50 rounded-xl border border-slate-700 flex items-center justify-center mb-4">
				<span class="text-3xl font-bold text-slate-400">T</span>
			</div>
			<h1 class="w-full text-center text-xl font-semibold text-slate-200">
				TVUPWEB
			</h1>
		</div>
		<AppSwitcherMenu isInline />
		<div class="flex w-full flex-1 flex-col items-center justify-between py-4">
			<p></p>
			<div class="flex flex-col gap-2 text-center">
				<Badge variant="default" className="mx-auto">
					v{import.meta.env.BUILD_VERSION}
				</Badge>
				<p class="text-xs text-gray-400">
					Last Updated:
					<br />
					<span class="text-gray-300"
						>{new Date(import.meta.env.BUILD_TIME).toLocaleString('en-CA', {
							year: 'numeric',
							month: '2-digit',
							day: '2-digit',
							hour: '2-digit',
							minute: '2-digit',
							second: '2-digit',
							hour12: false
						})}</span
					>
				</p>
			</div>
		</div>
	</div>
</Sidebar>

<main class="h-[calc(100%)] p-4 transition-all">
	{@render children()}
</main>
