<script lang="ts" module>
	type Props = {
		product: {
			id: string
			serialNo: string
			macID?: string
		}
	}
</script>

<script lang="ts">
	let { product }: Props = $props()

	import { TextBlock } from '$sveltewind/components/display'
</script>

{#if product}
	<div>
		<TextBlock href={`/wholesale/products/${product.id}`}>
			{product.serialNo}
		</TextBlock>
		{#if product.macID}
			<TextBlock class="text-gray-500">
				{product.macID}
			</TextBlock>
		{/if}
	</div>
{:else}
	-
{/if}
