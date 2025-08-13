<script lang="ts" module>
	import type { Snippet } from 'svelte'

	export type Props = {
		children?: Snippet
		class?: string
	}

	export const headerState = $state({
		title: '',
		class: ''
	})
</script>

<script lang="ts">
	let { children, class: classHeader }: Props = $props()

	import { twMerge } from 'tailwind-merge'
</script>

<header
	class={twMerge(
		'fixed top-0 z-50 inline-flex h-16 w-full transition-all duration-300',
		classHeader,
		headerState.class
	)}
>
	{#if children}
		{@render children()}
	{/if}
</header>
