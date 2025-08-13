<script lang="ts" module>
	type Props = {
		customer?: {
			id: string
			fullName: string
			phoneNumbers?: { value: string }[]
		}
		class?: string
	}
</script>

<script lang="ts">
	let { customer, class: classes }: Props = $props()

	import { TextBlock } from '$sveltewind/components/display'
</script>

{#if customer}
	<div class={classes}>
		<TextBlock href={`/billing/customers/${customer.id}`} class={classes}>
			{customer.fullName}
		</TextBlock>
		{#if customer.phoneNumbers?.[0]}
			<TextBlock class={classes}>
				{customer.phoneNumbers[0].value}
			</TextBlock>
		{/if}
	</div>
{:else}
	-
{/if}
