<script lang="ts" module>
	import type { Snippet } from 'svelte'

	export type Props = {
		children?: Snippet
	}
</script>

<script lang="ts">
	let { children }: Props = $props()

	import { SidebarToggle } from '$sveltewind/components/layouts'

	import NewCallRecord from '$lib/components/forms/NewCallRecord.svelte'
	import Announcement from '$lib/components/menu/Announcement.svelte'
	import TicketsMenu from '$lib/components/menu/TicketsMenu.svelte'
	import ChatSidebarToggle from '$lib/components/chat/ChatSidebarToggle.svelte'
	import ProfileMenu from '$lib/components/menu/ProfileMenu.svelte'
	import LogoutButton from '$lib/components/menu/LogoutButton.svelte'

	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	import { sidebarState } from '$sveltewind/components/layouts/Sidebar.svelte'

	import { twMerge } from 'tailwind-merge'
</script>

<div class={twMerge('flex items-center transition-all', sidebarState.isOpen && 'lg:pl-64')}>
	{#if !sidebarState.isOpen}
		<SidebarToggle />
	{/if}
	<h1 class="max-w-24 truncate leading-7 text-white lg:max-w-full lg:pl-2 lg:text-2xl">
		{headerState.title}
	</h1>
</div>
<div class="flex flex-1 justify-end lg:gap-4">
	{#if children}
		{@render children()}
	{/if}
	<div class="flex min-w-32 items-center gap-4 overflow-x-auto">
		<Announcement />
		<NewCallRecord />
		<TicketsMenu />
		<ChatSidebarToggle />
	</div>
	<div class="flex items-center lg:gap-4">
		<ProfileMenu />
		<LogoutButton />
	</div>
</div>
