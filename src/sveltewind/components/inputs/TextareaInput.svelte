<script lang="ts" module>
	import type { HTMLTextareaAttributes } from 'svelte/elements'
	import type { Snippet } from 'svelte'
	import type { MaskitoOptions } from '@maskito/core'

	type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
	type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N

	export type Props = Merge<
		HTMLTextareaAttributes,
		{
			name?: string
			label?: string
			labelSnippet?: Snippet
			rows?: number
			// value?: string | number | null
			mask?: MaskitoOptions['mask']
			onStopTyping?: (value: string) => void
			placeholder?: string
			error?: string | boolean
			isRequired?: boolean
			isReadOnly?: boolean
			isDisabled?: boolean
			hideDisabledIcon?: boolean
			leftChildren?: Snippet
			rightChildren?: Snippet
			bottomChildren?: Snippet
			classContainer?: string
			classLabel?: string
			classInputGroup?: string
			classInput?: string
			inputRef?: HTMLTextAreaElement
		}
	>
</script>

<script lang="ts">
	let {
		name = String(Date.now() + Math.random()),
		label,
		labelSnippet,
		rows = 3,
		value = $bindable(''),
		placeholder = '',
		error = '',
		isRequired = false,
		isReadOnly = false,
		isDisabled = false,
		hideDisabledIcon = false,
		leftChildren,
		rightChildren,
		bottomChildren,
		classContainer,
		classLabel,
		classInputGroup,
		classInput,
		mask,
		onStopTyping,
		inputRef = $bindable() as HTMLTextAreaElement,
		...restInputProps
	}: Props = $props()

	import { Alert } from '../display'
	import { NoSymbolIcon } from '../../icons'
	import { stopTyping } from '../../actions'

	import { twMerge } from 'tailwind-merge'
	import { Maskito } from '@maskito/core'

	const id = name + String(Date.now() + Math.random()) // used for aria attributes

	$effect(() => {
		if (!inputRef) return
		if (!mask) return
		const maskedInput = new Maskito(inputRef, { mask })
		return () => {
			maskedInput.destroy()
		}
	})
</script>

<div
	class={twMerge(
		'flex flex-col rounded-lg px-4 py-3 text-sm bg-slate-800/50 border border-slate-700 transition-all placeholder:text-slate-500 focus-within:border-slate-500 focus-within:bg-slate-800',
		error && 'border-red-500/50 bg-red-950/20',
		(isDisabled || isReadOnly) &&
			'cursor-not-allowed bg-slate-900/50 text-slate-500 opacity-60',
		classContainer
	)}
>
	<label
		for={id}
		class={twMerge(
			'text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1',
			isRequired && 'after:ml-1 after:text-red-400 after:content-["*"]',
			classLabel,
			!label && !labelSnippet && 'sr-only',
			(isDisabled || isReadOnly) && 'cursor-not-allowed opacity-60'
		)}
	>
		{#if labelSnippet}
			{@render labelSnippet()}
		{:else}
			{label || name}
		{/if}
	</label>
	<div class={twMerge('flex items-center gap-1', classInputGroup)}>
		{#if leftChildren}
			{@render leftChildren()}
		{/if}
		<textarea
			use:stopTyping={onStopTyping}
			bind:this={inputRef}
			{id}
			{name}
			{rows}
			readonly={isReadOnly}
			disabled={isDisabled}
			required={isRequired}
			{placeholder}
			bind:value
			class={twMerge(
				'flex-1 appearance-none border-0 bg-transparent text-white placeholder:text-slate-500 placeholder:text-sm focus:outline-0 disabled:cursor-not-allowed',
				classInput
			)}
			{...restInputProps}
		></textarea>
		{#if (isDisabled || isReadOnly) && !hideDisabledIcon}
			<NoSymbolIcon />
		{/if}
		{#if rightChildren}
			{@render rightChildren()}
		{/if}
	</div>
	{#if bottomChildren}
		{@render bottomChildren()}
	{/if}
	{#if error && error !== true}
		<Alert type="error" class="mt-1  py-1 text-xs" classIcon="size-4">{error}</Alert>
	{/if}
</div>
