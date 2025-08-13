<script lang="ts" module>
	import type { Props as TextInputProps } from './TextInput.svelte'
	import type { Locale } from '../../lib/datepicker/locale'

	type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
	type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N

	export type Props = Merge<
		TextInputProps,
		{
			onSelect?: (date: string) => void
			min?: Date // The earliest value the user can select
			max?: Date // The latest value the user can select
			locale?: Locale // Locale object for internationalization
		}
	>
</script>

<script lang="ts">
	import TextInput from './TextInput.svelte'
	import { maskitoDateOptionsGenerator } from '@maskito/kit'

	import DatePicker from '../../lib/datepicker/DatePicker.svelte'
	import { getPickerPosition } from '../../utils'
	import { clickOutside } from '../../actions'

	import { untrack, tick } from 'svelte'
	import { fly } from 'svelte/transition'
	import { cubicInOut } from 'svelte/easing'
	import { twMerge } from 'tailwind-merge'

	let {
		name,
		value = $bindable(null),
		onStopTyping,
		onSelect,
		min,
		max,
		inputRef = $bindable() as HTMLInputElement,
		...restInputProps
	}: Props = $props()

	const maskitoDateOptions = maskitoDateOptionsGenerator({
		mode: 'yyyy/mm/dd',
		separator: '-',
		min,
		max
	})

	let parsedValue = $state('')
	let maskValue = $state('')
	let datePickerValue = $state(null) as Date | null

	$effect(() => {
		// set initial values
		untrack(() => {
			// check if the value is a valid date
			if (value && new Date(value).toString() === 'Invalid Date') {
				value = null
			} else if (value) {
				const initialValue = value instanceof Date ? value : new Date(value + 'T00:00:00')
				initialValue.setHours(0, 0, 0, 0)
				parsedValue = initialValue.toISOString().slice(0, 10)
				maskValue = initialValue.toISOString().slice(0, 10)
				datePickerValue = initialValue
			}
		})
	})

	let isPickerOpen = $state(false)
	let pickerRef = $state() as HTMLElement
	let pickerLeftPosition = $state() as number
	let pickerTopPosition = $state() as number

	$effect(() => {
		;({ pickerLeftPosition, pickerTopPosition } = getPickerPosition(inputRef, pickerRef))
	})

	function flyAutoPosition(node: HTMLElement) {
		untrack(() => {
			;({ pickerLeftPosition, pickerTopPosition } = getPickerPosition(inputRef, pickerRef))
		})

		return fly(node, {
			duration: 200,
			easing: cubicInOut
		})
	}

	const onBlur = () => {
		if (maskValue === parsedValue) return
		if (maskValue) {
			const [year, month, day] = maskValue.split('-').map(Number)
			const validYear = Math.min(9999, Math.max(0, year))
			const validMonth = Math.min(12, Math.max(1, month))
			const validDay = Math.min(31, Math.max(1, day))
			const datePart = `${String(validYear).padStart(4, '0')}-${String(validMonth).padStart(2, '0')}-${String(validDay).padStart(2, '0')}`
			maskValue = datePart
			parsedValue = datePart
		} else {
			parsedValue = maskValue
		}
	}

	$effect(() => {
		if (!inputRef) return
		// open the date picker when the input is focused
		const onFocus = () => {
			isPickerOpen = true
		}
		inputRef.addEventListener('focus', onFocus)
		inputRef.addEventListener('click', onFocus)
		return () => {
			inputRef.removeEventListener('focus', onFocus)
			inputRef.removeEventListener('click', onFocus)
		}
	})

	$effect(() => {
		if (maskValue) {
			const [year, month, day] = maskValue.split('-').map(Number)
			const validYear = Math.min(9999, Math.max(0, year))
			const validMonth = month ? Math.min(12, Math.max(1, month)) : 1
			const validDay = day ? Math.min(31, Math.max(1, day)) : 1
			untrack(() => {
				const datePart = `${String(validYear).padStart(4, '0')}-${String(validMonth).padStart(2, '0')}-${String(validDay).padStart(2, '0')}`
				datePickerValue = new Date(datePart + ', 00:00:00')
				parsedValue = datePart
			})
		}
	})

	$effect(() => {
		value = parsedValue
	})
</script>

<input {name} bind:value={parsedValue} class="sr-only" tabindex="-1" />

<div
	use:clickOutside={() => {
		isPickerOpen = false
	}}
>
	<TextInput
		bind:inputRef
		bind:value={maskValue}
		classInput="pt-0.5"
		maskitoOptions={maskitoDateOptions}
		onblur={onBlur}
		onStopTyping={() => {
			onStopTyping?.(parsedValue)
		}}
		onkeydown={async (e) => {
			// if the user presses enter, set the value to the parsedValue
			if (e.key === 'Enter') {
				onBlur()
				isPickerOpen = false
				await tick()
				onStopTyping?.(parsedValue)
				onSelect?.(parsedValue)
			}
		}}
		{...restInputProps}
	/>

	{#if isPickerOpen}
		<div
			class={twMerge('fixed z-30')}
			style:top={pickerTopPosition - 3 + 'px'}
			style:left={pickerLeftPosition + 'px'}
			bind:this={pickerRef}
			transition:flyAutoPosition
		>
			<DatePicker
				bind:value={datePickerValue}
				{min}
				{max}
				onSelect={async (date) => {
					if (date) {
						maskValue = date.toISOString().slice(0, 10)
					} else {
						maskValue = ''
					}
					await tick()
					onBlur()
					await tick()
					onStopTyping?.(parsedValue)
					isPickerOpen = false
					onSelect?.(parsedValue)
				}}
			/>
		</div>
	{/if}
</div>
