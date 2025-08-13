<script lang="ts">
	import { GhostButton } from '$sveltewind/components/buttons'
	import { sidebarState } from '$sveltewind/components/layouts/Sidebar.svelte'
	import { ArrowDownIcon } from '$sveltewind/icons'

	import { untrack } from 'svelte'
	import { page } from '$app/state'
	import { slide } from 'svelte/transition'
	import { twMerge } from 'tailwind-merge'
	import { goto } from '$app/navigation'

	$effect(() => {
		untrack(() => {
			sidebarState.expandedLinks = JSON.parse(
				page.data.session.cookies[sidebarState.persistCookieName] || '[]'
			)
		})
	})

	const CLASS =
		'items-center justify-start w-full text-gray-300 hover:bg-gray-500/20 hover:text-white focus-visible:bg-gray-200/20 focus-visible:text-white text-sm focus-visible:animate-pulse py-2.5 mb-1'

	const checkIfActive = (id: string, href: string) => {
		let isActive = false
		if (page.url.pathname === id) {
			isActive = true
		} else if (page.url.pathname === href) {
			isActive = true
		} else if (
			page.url.pathname.includes(id) &&
			!page.url.pathname.endsWith(id) &&
			page.url.pathname.split('/').length !== 3
		) {
			isActive = true
		} else if (page.url.pathname.includes(id) && page.url.pathname.split('/').length === 4) {
			isActive = true
		}
		return isActive
	}
</script>

<!-- prettier-ignore -->
{#snippet sidebarSingleItem({ sidebarItem, isActive }: { sidebarItem: typeof sidebarState.sidebarItems[0], isActive: boolean })}
	<GhostButton
		href={sidebarItem.href}
		onclick={() => {
			// Close the sidebar on mobile
			if (window.innerWidth < 1024) {
				sidebarState.isOpen = false
			}
		}}
		class={twMerge(CLASS, isActive && 'bg-gray-200/20 text-white')}
	>
		<sidebarItem.icon class="mr-3" > </sidebarItem.icon>
		<div class="flex w-full items-center justify-between">
			<div>{sidebarItem.title}</div>
						{#if sidebarItem.notificationCount}
				<div
					class="inline-flex items-center rounded-full bg-yellow-200 px-2 py-0.5 text-xs font-medium text-yellow-800"
				>
					{sidebarItem.notificationCount}
				</div>
			{/if}
		</div>
	</GhostButton>
{/snippet}

<!-- prettier-ignore -->
{#snippet sidebarExpandableItem({ sidebarItem, isExpanded, isActive }: { sidebarItem: typeof sidebarState.sidebarItems[0], isExpanded: boolean, isActive: boolean })}
	<GhostButton
		class={twMerge(CLASS, isActive && (!isExpanded || sidebarItem.href) && 'bg-gray-300/20 text-white')}
		aria-controls={sidebarItem.id}
		aria-expanded={isExpanded}
		onclick={() => {
			if (sidebarItem.href) {
				goto(sidebarItem.href)
				// Close the sidebar on mobile
				if (window.innerWidth < 1024) {
					sidebarState.isOpen = false
				}
			} else {
				sidebarState.toggleLink(sidebarItem.id)
			}
		}}
	>
		<sidebarItem.icon class="mr-3"></sidebarItem.icon>
		{sidebarItem.title}
		{#if !sidebarItem.href}
		<ArrowDownIcon
			class={twMerge('ml-auto size-4 shrink-0 transition-transform', !isExpanded && '-rotate-90')}
		/>
		{/if}
	</GhostButton>
{/snippet}

{#snippet itemSnippet({
	id = 'sidebar',
	items,
	customClass = ''
}: {
	id?: string
	items: typeof sidebarState.sidebarItems
	customClass?: string
})}
	<ul {id} role="list" class={twMerge('flex flex-1 flex-col gap-0.5', customClass)} in:slide>
		{#each items as sidebarItem (sidebarItem.id)}
			{#if !sidebarItem.isVisibleCheck || sidebarItem.isVisibleCheck()}
				<li>
					{#if sidebarItem.subLinks && sidebarItem.subLinks.length > 0}
						{@const isExpanded =
							(sidebarItem.subLinks && sidebarState.expandedLinks.includes(sidebarItem.id)) ||
							!!sidebarItem.href}
						{@const isActive = checkIfActive(sidebarItem.id, sidebarItem.href || '')}
						{@render sidebarExpandableItem({
							sidebarItem,
							isExpanded,
							isActive
						})}
						{#if isExpanded}
							{@render itemSnippet({
								items: sidebarItem.subLinks,
								id: sidebarItem.id,
								customClass: 'px-2 pl-8'
							})}
						{/if}
					{:else}
						{@const isActive = checkIfActive(sidebarItem.id, sidebarItem.href || '')}
						{@render sidebarSingleItem({ sidebarItem, isActive })}
					{/if}
				</li>
			{/if}
		{/each}
	</ul>
{/snippet}

<nav class="flex flex-1 flex-col overflow-y-auto overscroll-contain px-2">
	{@render itemSnippet({
		items: sidebarState.sidebarItems
	})}
</nav>
