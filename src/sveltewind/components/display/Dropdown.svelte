<script lang="ts" module>
	import type { Snippet } from 'svelte'
	import type { TransitionConfig } from 'svelte/transition'

	export type Props = {
		trigger: Snippet<[{ open: () => void; close: () => void; isOpen: boolean }]>
		children: Snippet<[{ close: () => void }]>
		onClose?: () => void
		placement?:
			| 'bottom-right'
			| 'bottom-left'
			| 'bottom-center'
			| 'top-right'
			| 'top-left'
			| 'top-center'
		class?: string
	}
</script>

<script lang="ts">
	import { cubicOut } from 'svelte/easing'

	import { clickOutside, trapDropdown } from '../../actions'

	import { twMerge } from 'tailwind-merge'

	const {
		trigger,
		children,
		placement = 'bottom-left',
		onClose: onCloseFn,
		class: classes
	}: Props = $props()

	let isOpen = $state(false)

	const open = () => {
		isOpen = true
	}

	const close = () => {
		if (!isOpen) return
		onCloseFn?.()
		isOpen = false
	}

	function slideFade(node: HTMLElement): TransitionConfig {
		let transformOrigin = 'top left'
		if (placement === 'bottom-left') {
			transformOrigin = 'top left'
		} else if (placement === 'bottom-center') {
			transformOrigin = 'top center'
		} else if (placement === 'bottom-right') {
			transformOrigin = 'top right'
		} else if (placement === 'top-left') {
			transformOrigin = 'bottom left'
		} else if (placement === 'top-center') {
			transformOrigin = 'bottom center'
		} else if (placement === 'top-right') {
			transformOrigin = 'bottom right'
		}
		const existingTransform = getComputedStyle(node).transform.replace('none', '')
		return {
			delay: 0,
			duration: 400,
			easing: cubicOut,
			css: (t: number) =>
				`transform-origin: ${transformOrigin}; transform: ${existingTransform} scaleY(${t}); opacity: ${t};`
		}
	}
</script>

<div class="relative" use:clickOutside={close}>
	{@render trigger({ open, close, isOpen })}
	{#if isOpen}
		<div
			use:trapDropdown
			transition:slideFade|local
			class={twMerge(
				'absolute z-50 min-w-[8rem] rounded-md bg-white shadow-xl',
				placement === 'bottom-left' && 'top-10 left-0',
				placement === 'bottom-center' && 'top-10 left-1/2 -translate-x-1/2 transform',
				placement === 'bottom-right' && 'top-10 right-0',
				placement === 'top-left' && 'bottom-10 left-0',
				placement === 'top-center' && 'bottom-10 left-1/2 -translate-x-1/2 transform',
				placement === 'top-right' && 'right-0 bottom-10',
				classes
			)}
		>
			{@render children({ close })}
		</div>
	{/if}
</div>
