<script lang="ts" module>
	import type { Snippet, Component } from 'svelte'

	type Props = {
		children?: Snippet
		class?: string
	}

	type SidebarItem = {
		id: string
		title: string
		icon: Component
		notificationCount?: number
		href?: string
		isVisibleCheck?: () => boolean
		subLinks?: SidebarItem[]
	}

	export const sidebarState = $state({
		isOpen: true,
		sidebarItems: [] as SidebarItem[],
		class: '',
		expandedLinks: [] as string[],
		persistCookieName: 'TVUPWEB_SIDEBAR_STATE',
		toggleLink: (link: string) => {
			if (sidebarState.expandedLinks.includes(link)) {
				sidebarState.expandedLinks = sidebarState.expandedLinks.filter((l) => l !== link)
			} else {
				sidebarState.expandedLinks = [...sidebarState.expandedLinks, link]
			}
			sidebarState.saveState()
		},
		saveState: () => {
			// save to cookie so it persists across sessions
			document.cookie = `${sidebarState.persistCookieName}=${JSON.stringify(
				sidebarState.expandedLinks
			)};path=/;secure; max-age=31536000`
		}
	})
</script>

<script lang="ts">
	let { children, class: classSidebar }: Props = $props()

	import { twMerge } from 'tailwind-merge'
	import { slide } from 'svelte/transition'
</script>

{#if sidebarState.isOpen}
	<button
		aria-label="Backdrop button"
		type="button"
		class="fixed inset-0 z-30 bg-slate-900/70 backdrop-blur-sm lg:hidden"
		onclick={() => {
			sidebarState.isOpen = false
		}}
	>
	</button>
	<aside
		class={twMerge('fixed inset-0 z-60 w-64 overflow-hidden', classSidebar)}
		transition:slide={{ duration: 300, axis: 'x' }}
	>
		{#if children}
			{@render children()}
		{/if}
	</aside>
{/if}
