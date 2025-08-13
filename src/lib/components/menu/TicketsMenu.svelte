<script lang="ts">
	import { GhostButton } from '$sveltewind/components/buttons'
	import { TicketIcon } from '$icons'

	import { page } from '$app/state'
</script>

<GhostButton
	href="/tickets?status=OPEN&assignedTo=me"
	class="p-1 text-xs text-white hover:bg-gray-800/50 focus-visible:bg-gray-700 lg:px-4 lg:py-3"
>
	<div class="relative">
		<TicketIcon class="lg:mr-1" />
		{#if page.data.session.unresolvedTicketsCount}
			<div class="absolute -top-3 -right-2 text-center text-xs">
				<span
					class="relative inline-flex size-5 justify-center rounded-full bg-red-500 p-0.5 text-white"
					>{page.data.session.unresolvedTicketsCount}</span
				>
			</div>
		{/if}
	</div>
	<span class="sr-only lg:not-sr-only">Tickets</span>
</GhostButton>
