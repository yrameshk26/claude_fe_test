<script lang="ts" module>
	type Props = {
		path: string
		record: {
			id: string
			name?: string
			phoneNo?: string
		}
		class?: string
	}
</script>

<script lang="ts">
	let { path, record, class: classes }: Props = $props()

	import { TextBlock } from '$sveltewind/components/display'
	import { twMerge } from 'tailwind-merge'
</script>

<div class={twMerge('flex flex-col items-center', classes)}>
	{#if record}
		{#if record.name}
			<TextBlock href={`${path}/${record.id}`}>{record.name}</TextBlock>
		{/if}
	{:else}
		-
	{/if}
</div>
