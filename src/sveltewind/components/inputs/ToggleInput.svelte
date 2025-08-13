<script lang="ts" module>
	import type { Snippet } from 'svelte'

	export type Props = {
		name?: string
		label?: string
		labelSnippet?: Snippet
		value?: boolean
		onToggle?: (value: boolean) => void
		error?: string | boolean
		isRequired?: boolean
		isDisabled?: boolean
		hideDisabledIcon?: boolean
		leftChildren?: Snippet
		rightChildren?: Snippet
		bottomChildren?: Snippet
		classContainer?: string
		classLabel?: string
		classInputGroup?: string
		classInput?: string
	}
</script>

<script lang="ts">
	let {
		name = String(Date.now() + Math.random()),
		label,
		labelSnippet,
		value = $bindable(false),
		onToggle,
		error = '',
		isRequired = false,
		isDisabled = false,
		hideDisabledIcon = false,
		leftChildren,
		rightChildren,
		bottomChildren,
		classContainer,
		classLabel,
		classInputGroup,
		classInput
	}: Props = $props()

	import { Alert } from '../display'
	import { NoSymbolIcon } from '../../icons'

	import { twMerge } from 'tailwind-merge'
	import { tick } from 'svelte'

	const id = name + String(Date.now() + Math.random()) // used for aria attributes
</script>

<div
	class={twMerge(
		'focus-within:ring-textInput flex flex-col rounded-md px-3 py-1 text-sm ring-1 ring-gray-300 transition-all placeholder:text-xs focus-within:border-transparent focus-within:ring-2 focus-within:outline-2 focus-within:outline-transparent',
		error && 'ring-red-500',
		isDisabled &&
			'cursor-not-allowed bg-gray-200/50 text-gray-500 hover:bg-gray-200/50 active:translate-y-0',
		classContainer
	)}
>
	<label
		for={id}
		class={twMerge(
			'text-xs font-bold text-gray-900',
			isRequired && 'after:ml-1 after:text-red-500 after:content-["*"]',
			classLabel,
			!label && !labelSnippet && 'sr-only',
			isDisabled && 'cursor-not-allowed rounded-md bg-gray-100'
		)}
	>
		{#if labelSnippet}
			{@render labelSnippet()}
		{:else}
			{label || name}
		{/if}
	</label>
	<div class={twMerge('flex items-center gap-1 pt-1', classInputGroup)}>
		{#if leftChildren}
			{@render leftChildren()}
		{/if}
		<button
			id={id + '-toggle'}
			disabled={isDisabled}
			type="button"
			class={twMerge(
				'relative mt-0.5 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:cursor-not-allowed',
				!value && 'bg-gray-200',
				value && 'bg-textInput',
				classInput
			)}
			role="switch"
			aria-checked={!!value}
			onclick={async () => {
				value = !value
				await tick()
				onToggle?.(!value)
			}}
		>
			<span class="sr-only">Toggle Value</span>
			<span
				class={twMerge(
					'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
					value && 'translate-x-5',
					!value && 'translate-x-0'
				)}
			>
				{#if !value}
					<span class="absolute inset-0 flex h-full w-full items-center justify-center">
						<svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
							<path
								d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</span>
				{:else}
					<span class="absolute inset-0 flex h-full w-full items-center justify-center">
						<svg class="text-textInput h-3 w-3" fill="currentColor" viewBox="0 0 12 12">
							<path
								d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z"
							/>
						</svg>
					</span>
				{/if}
			</span>
		</button>

		<input
			disabled={isDisabled}
			tabindex={-1}
			{id}
			{name}
			type="checkbox"
			bind:checked={value}
			class="sr-only"
		/>
		<div class="flex flex-1 justify-end">
			{#if isDisabled && !hideDisabledIcon}
				<NoSymbolIcon />
			{/if}
			{#if rightChildren}
				{@render rightChildren()}
			{/if}
		</div>
	</div>
	{#if bottomChildren}
		{@render bottomChildren()}
	{/if}
	{#if error && error !== true}
		<Alert type="error" class="mt-1 py-1 text-xs" classIcon="size-4">{error}</Alert>
	{/if}
</div>
