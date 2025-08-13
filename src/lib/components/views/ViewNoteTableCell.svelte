<script lang="ts" module>
	type Props = {
		notes: {
			details: string
		}[]
	}
</script>

<script lang="ts">
	let { notes = [] }: Props = $props()

	import { twMerge } from 'tailwind-merge'
	import { TextBlock } from '$sveltewind/components/display'
</script>

{#if notes[0]?.details}
	<TextBlock
		class={twMerge(
			'max-h-12 items-center overflow-y-auto',
			notes[0]?.details.length > 50 && 'items-start'
		)}
	>
		{notes[0]?.details}
	</TextBlock>
{/if}
