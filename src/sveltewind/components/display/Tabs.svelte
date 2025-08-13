<script lang="ts" module>
	export type Props = {
		links?: {
			label: string
			href: string
		}[]
	}
</script>

<script lang="ts">
	let { links = [] }: Props = $props()

	import { GhostButton } from '../buttons'
	import { page } from '$app/state'

	const goBack = () => {
		history.back()
	}
</script>

<div class="mb-1 flex h-[56px] items-center gap-4 overflow-x-auto rounded-md bg-gray-100 px-4 py-2">
	<GhostButton onclick={goBack} class="text-nowrap" --color-ghostButton="var(--color-primary)">
		&#x25c0; Go Back
	</GhostButton>
	{#each links as { label, href } (href)}
		{#if href.split('?')[0] === page.url.pathname}
			<GhostButton
				{href}
				data-sveltekit-replacestate
				--color-ghostButton="var(--color-blue-500)"
				class="bg-blue-100 text-sm  text-nowrap"
				disabled
			>
				{label}
			</GhostButton>
		{:else}
			<GhostButton
				{href}
				data-sveltekit-replacestate
				class=" text-nowrap"
				--color-ghostButton="var(--color-blue-500)"
			>
				{label}
			</GhostButton>
		{/if}
	{/each}
</div>
