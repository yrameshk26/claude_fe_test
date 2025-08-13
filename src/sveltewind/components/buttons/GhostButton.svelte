<script lang="ts" module>
	import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements'

	export type Props = {
		children: import('svelte').Snippet
		href?: string
		isDisabled?: boolean
		hideDisabledIcon?: boolean
		isLoading?: boolean
		class?: string
		classLoadingIcon?: string
	} & (HTMLButtonAttributes & HTMLAnchorAttributes)
</script>

<script lang="ts">
	import { twMerge } from 'tailwind-merge'

	import { LoadingIcon, NoSymbolIcon } from '../../icons'

	let {
		children,
		href,
		isDisabled = false,
		hideDisabledIcon = false,
		isLoading = false,
		class: classButton,
		classLoadingIcon,
		...restProps
	}: Props = $props()

	const CLASSES = $derived(
		twMerge(
			'text-ghostButton hover:bg-ghostButton/30 focus-visible:hover:bg-ghostButton/20 focus-visible:bg-ghostButton/10 inline-flex cursor-pointer items-center justify-center rounded-md px-3 py-2 text-start text-sm font-semibold transition-all focus-visible:outline-none active:translate-y-0.5 disabled:cursor-not-allowed',
			isDisabled &&
				'cursor-not-allowed bg-gray-200/50 text-gray-500 hover:bg-gray-200/50 active:translate-y-0',
			isLoading && 'cursor-not-allowed',
			href && isDisabled && 'pointer-events-none',
			classButton
		)
	)
</script>

{#if href}
	<a {href} {...restProps} class={CLASSES} tabindex={isDisabled ? -1 : 0}>
		{#if isLoading}
			<LoadingIcon class={twMerge(classLoadingIcon, 'mr-2')} />
		{:else if isDisabled}
			<NoSymbolIcon class="mr-2" />
		{/if}
		{@render children()}
	</a>
{:else}
	<button type="button" disabled={isDisabled} {...restProps} class={CLASSES}>
		{#if isLoading}
			<LoadingIcon class={twMerge(classLoadingIcon, 'mr-2')} />
		{:else if isDisabled && !hideDisabledIcon}
			<NoSymbolIcon class="mr-2" />
		{/if}
		{@render children()}
	</button>
{/if}
