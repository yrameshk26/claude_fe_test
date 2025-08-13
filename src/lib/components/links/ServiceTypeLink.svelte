<script lang="ts" module>
	type Props = {
		serviceType?: {
			id: string
			name: string
			color: string
		}
	}
</script>

<script lang="ts">
	let { serviceType }: Props = $props()

	import { TextBlock } from '$sveltewind/components/display'
</script>

{#if serviceType}
	<div class="flex items-center">
		<span
			style:background-color={serviceType.color as string}
			class="mr-2 inline-block h-3 w-3 rounded-full"
		>
		</span>
		<TextBlock href={`/billing/serviceTypes?q=id_equals_${serviceType.id}`}>
			{serviceType.name}
		</TextBlock>
	</div>
{:else}
	-
{/if}
