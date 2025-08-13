<script lang="ts" module>
	type Props = {
		serviceTypeUrl?: {
			id: string
			urlName: string
		}
	}
</script>

<script lang="ts">
	let { serviceTypeUrl }: Props = $props()

	import { TextBlock } from '$sveltewind/components/display'
	import { UrlIcon } from '$icons'
</script>

{#if serviceTypeUrl}
	<div class="flex items-center">
		<UrlIcon class="mr-2 size-3" />
		<TextBlock href={`/billing/serviceTypeURLs?q=id_equals_${serviceTypeUrl.id}`}>
			{serviceTypeUrl.urlName}
		</TextBlock>
	</div>
{:else}
	-
{/if}
