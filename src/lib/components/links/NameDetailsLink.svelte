<script lang="ts" module>
	type Props = {
		path: string
		record: {
			id: string
			name: string
			details: string
		}
		class?: string
	}
</script>

<script lang="ts">
	let { path, record, class: classes }: Props = $props()

	import { TextBlock } from '$sveltewind/components/display'
</script>

{#if record}
	<div>
		<TextBlock href={`${path}?q=id_equals_${record.id}`} class={classes}>
			{record.name}
		</TextBlock>
		{#if record.details}
			<TextBlock class="-my-1 text-gray-500">
				{record.details}
			</TextBlock>
		{/if}
	</div>
{:else}
	-
{/if}
