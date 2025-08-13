<script lang="ts" module>
	type Props = {
		service: {
			id: string
			macID?: string
			accountNumber?: string
		}
	}
</script>

<script lang="ts">
	let { service }: Props = $props()

	import { TextBlock } from '$sveltewind/components/display'
</script>

{#if service}
	<div>
		{#if service.macID}
			<TextBlock href={`/billing/services/${service.id}`}>{service.macID}</TextBlock>
		{/if}
		{#if service.accountNumber}
			<TextBlock href={`/billing/services/${service.id}`}>{service.accountNumber}</TextBlock>
		{/if}
	</div>
{:else}
	-
{/if}
