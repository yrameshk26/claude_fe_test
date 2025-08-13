<script lang="ts">
	import { GhostButton } from '../../components/buttons'
	import { sidebarState } from '../../components/layouts/Sidebar.svelte'
	import { SidebarCollapseIcon, SidebarExpandIcon } from '../../icons'
</script>

<GhostButton
	onclick={() => {
		sidebarState.isOpen = !sidebarState.isOpen
	}}
	class="h-fit text-white hover:bg-gray-500/20 hover:bg-gray-800/50 focus-visible:bg-gray-700"
>
	{#if sidebarState.isOpen}
		<span class="sr-only">Close sidebar</span>
		<SidebarCollapseIcon />
	{:else}
		<span class="sr-only">Open sidebar</span>
		<SidebarExpandIcon />
	{/if}
</GhostButton>
