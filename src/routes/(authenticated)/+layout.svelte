<script lang="ts">
	import { invalidateAll } from '$app/navigation'
	import { page } from '$app/state'
	import { connectWebSocket } from '$lib/utils/websocket'

	import { twMerge } from 'tailwind-merge'

	// import InactivityPopup from '$lib/components/InactivityPopup.svelte'
	import AppSwitcherMenu from '$lib/components/menu/AppSwitcherMenu.svelte'

	import { Header } from '$sveltewind/components/layouts'
	import HeaderNav from '$lib/components/HeaderNav.svelte'
	import ChatSidebar from '$lib/components/chat/ChatSidebar.svelte'

	import { Sidebar, SidebarToggle } from '$sveltewind/components/layouts'
	import { sidebarState } from '$sveltewind/components/layouts/Sidebar.svelte'
	import SidebarNav from '$lib/components/SidebarNav.svelte'
	import { untrack } from 'svelte'

	let { children } = $props()

	$effect.root(() => {
		let ws: ReturnType<typeof connectWebSocket>
		let invalidateTimeout
		untrack(() => {
			ws = connectWebSocket('APP_UPDATED_BY', (message) => {
				const { data: result } = message
				if (invalidateTimeout) clearTimeout(invalidateTimeout)
				if (result.authUserID !== page.data.session?.id) {
					invalidateTimeout = setTimeout(() => {
						invalidateAll()
					}, 7000)
				}
			})
		})
		return () => {
			ws?.disconnect()
			if (invalidateTimeout) clearTimeout(invalidateTimeout)
		}
	})
</script>

<!-- <InactivityPopup /> -->

<ChatSidebar />

<Header>
	<div class="flex w-full items-center gap-2 px-2">
		<HeaderNav />
	</div>
</Header>

<Sidebar class={twMerge('w-60', sidebarState.class)}>
	<div class="flex h-full flex-col">
		<div class="flex w-full justify-end gap-2 py-2.5">
			<AppSwitcherMenu />
			<SidebarToggle />
		</div>
		<SidebarNav />
	</div>
</Sidebar>

<main
	class={twMerge('mt-16 h-[calc(100%-64px)] p-4 transition-all', sidebarState.isOpen && 'lg:ml-60')}
>
	{@render children()}
</main>
