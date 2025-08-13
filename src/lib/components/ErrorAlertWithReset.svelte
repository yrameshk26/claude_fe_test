<script lang="ts" module>
	type Props = {
		errors: string[]
	}
</script>

<script lang="ts">
	import { Alert } from '$sveltewind/components/display'
	import { RefreshIcon } from '$sveltewind/icons'
	import { GhostButton } from '$sveltewind/components/buttons'

	import { page } from '$app/state'

	let { errors }: Props = $props()
</script>

<Alert type="error" class="items-center">
	<div class="text-left text-sm">
		{#each errors as error (error)}
			{error}
		{/each}
	</div>
	{#if page.url.searchParams.toString()}
		<GhostButton
			onclick={async () => {
				window.location.href = page.url.pathname
			}}
		>
			<RefreshIcon class="mr-2 size-4" />
			Reset
		</GhostButton>
	{/if}
</Alert>
