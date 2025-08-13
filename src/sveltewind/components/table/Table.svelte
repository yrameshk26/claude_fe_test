<script lang="ts" module>
	import type { Snippet } from 'svelte'

	type Props = {
		tableHead?: Snippet
		tableRows: Snippet
		classContainer?: string
		classFooter?: string
	}
</script>

<script lang="ts">
	import { afterNavigate } from '$app/navigation'

	afterNavigate(() => {
		// reset scroll position of container
		const container = document.getElementById('container')
		if (container) container.scrollTop = 0
	})

	import { twMerge } from 'tailwind-merge'

	let { tableHead, tableRows, classContainer }: Props = $props()
</script>

<div id="container" class={twMerge('relative overflow-auto', classContainer)}>
	<table class="table-fixed border-separate border-spacing-0">
		{#if tableHead}
			{@render tableHead()}
		{/if}
		<tbody class="h-full">
			{@render tableRows()}
		</tbody>
	</table>
</div>
