<script lang="ts">
	import { navigating } from '$app/state'

	// Only show the loading animation if the page takes longer than 500ms to load
	let show = $state(false)
	$effect(() => {
		let timeout: ReturnType<typeof setTimeout>
		if (!navigating.delta) {
			show = false
		} else {
			timeout = setTimeout(() => {
				show = true
			}, 500) // Only show the loading animation if the page takes longer than 500ms to load
		}
		return () => clearTimeout(timeout)
	})
</script>

{#if show}
	<div
		class="fixed inset-0 z-50 flex h-screen w-full flex-col items-center justify-center gap-2 overflow-hidden bg-gray-900/50 backdrop-blur-sm"
	>
		<div class="flex w-full flex-col items-center gap-3 text-white">
			<svg class="size-16 animate-spin" fill="none" viewBox="0 0 24 24">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				/>
			</svg>

			<h2 class="text-xl font-semibold">Loading...</h2>
			<p class="">This may take a moment.</p>
		</div>
	</div>
{/if}
