<script lang="ts" module>
	import { tick } from 'svelte'
	import type { Props as TextInputProps } from './TextInput.svelte'

	type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
	type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N

	export type Props = Merge<
		TextInputProps,
		{
			name?: string
			value?: string
			onStopTyping?: (value: string) => void
			inputRef?: HTMLInputElement
		}
	>
</script>

<script lang="ts">
	import TextInput from './TextInput.svelte'
	import { maskitoTimeOptionsGenerator } from '@maskito/kit'

	let {
		name,
		value = $bindable('') as string,
		onStopTyping,
		inputRef = $bindable() as HTMLInputElement,
		...restInputProps
	}: Props = $props()

	const maskitoTimeOptions = maskitoTimeOptionsGenerator({
		mode: 'HH:MM:SS',
		step: 1
	})

	const checkIfValidTime = (value: string) => {
		const [hours, minutes, seconds] = value.split(':').map(Number)
		return (
			hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59 && seconds >= 0 && seconds <= 59
		)
	}

	let parsedValue = $derived(checkIfValidTime(value) ? value : '')
	let maskValue = $derived(checkIfValidTime(value) ? value : '')

	const onBlur = () => {
		if (maskValue) {
			const [hours, minutes, seconds] = maskValue.split(':').map(Number)
			const validHours = Math.min(23, Math.max(0, hours))
			const validMinutes = minutes ? Math.min(59, Math.max(0, minutes)) : 0
			const validSeconds = seconds ? Math.min(59, Math.max(0, seconds)) : 0
			const timePart = `${String(validHours).padStart(2, '0')}:${String(validMinutes).padStart(2, '0')}:${String(validSeconds).padStart(2, '0')}`
			maskValue = timePart
			parsedValue = timePart
		} else {
			parsedValue = maskValue
		}
	}

	$effect(() => {
		value = parsedValue
	})

	$effect(() => {
		parsedValue = maskValue
	})
</script>

<input {name} bind:value={parsedValue} class="sr-only" tabindex="-1" />

<TextInput
	bind:inputRef
	bind:value={maskValue}
	maskitoOptions={maskitoTimeOptions}
	onblur={onBlur}
	onStopTyping={() => {
		onStopTyping?.(parsedValue)
	}}
	onkeydown={async (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			onBlur()
			await tick()
		}
	}}
	{...restInputProps}
/>
