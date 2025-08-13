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
	import { maskitoDateTimeOptionsGenerator, maskitoTimeOptionsGenerator } from '@maskito/kit'

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

	const maskitoDateOptions = maskitoDateTimeOptionsGenerator({
		dateMode: 'yyyy/mm/dd',
		timeMode: 'HH:MM',
		dateSeparator: '-',
		min,
		max
	})
	const maskitoTimeOptions = maskitoTimeOptionsGenerator({
		mode: 'HH:MM',
		step: 1
	})

	let parsedValue = $state('')
	let maskValue = $state('')
	let datePickerValue = $state(null) as Date | null
	let timeInputRef = $state() as HTMLInputElement
	let timePickerValue = $state('') as string

	$effect(() => {
		// set initial values
		untrack(() => {
			// check if the value is a valid date
			if (value && new Date(value).toString() === 'Invalid Date') {
				value = null
			} else if (value) {
				const initialValue = new Date(value)
				parsedValue = initialValue.toLocaleString('en-CA', {
					year: 'numeric',
					month: '2-digit',
					day: '2-digit',
					hour: '2-digit',
					minute: '2-digit',
					hour12: false
				})
				maskValue = parsedValue
				datePickerValue = initialValue
				timePickerValue = initialValue.toLocaleString('en-CA', {
					hour: '2-digit',
					minute: '2-digit',
					hour12: false
				})
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
			const [date, time = '00:00'] = maskValue.split(', ')
			const [year, month, day] = date.split('-').map(Number)
			const validYear = Math.min(9999, Math.max(0, year))
			const validMonth = month ? Math.min(12, Math.max(1, month)) : 1
			const validDay = day ? Math.min(31, Math.max(1, day)) : 1
			const datePart = `${String(validYear).padStart(4, '0')}-${String(validMonth).padStart(2, '0')}-${String(validDay).padStart(2, '0')}`
			datePickerValue = new Date(`${datePart} 00:00:00`)
			const [hour, minute] = time.split(':').map(Number)
			const validHour = Math.min(23, Math.max(0, hour))
			const validMinute = minute ? Math.min(59, Math.max(0, minute)) : 0
			const timePart = `${String(validHour).padStart(2, '0')}:${String(validMinute).padStart(2, '0')}`
			timePickerValue = timePart
			maskValue = `${datePart}, ${timePart}`
			parsedValue = `${datePart}, ${timePart}`
		} else {
			parsedValue = maskValue
		}
	}

	const onTimeInputBlur = () => {
		let timePart = ''
		if (timePickerValue) {
			const [hours, minutes] = timePickerValue.split(':').map(Number)
			const validHours = Math.min(23, Math.max(0, hours))
			const validMinutes = minutes ? Math.min(59, Math.max(0, minutes)) : 0
			timePart = `${String(validHours).padStart(2, '0')}:${String(validMinutes).padStart(2, '0')}`
		} else {
			timePart = '00:00'
		}
		let datePart = new Date().toLocaleDateString('en-CA', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		})
		if (datePickerValue) {
			datePart = datePickerValue.toLocaleString('en-CA', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit'
			})
		}
		maskValue = `${datePart}, ${timePart}`
		parsedValue = `${datePart}, ${timePart}`
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
		if (timePickerValue) {
			untrack(() => {
				// update only the time part of maskValue
				untrack(() => {
					if (!datePickerValue) {
						datePickerValue = new Date()
					}
					inputRef.value = `${datePickerValue.toLocaleString('en-CA', {
						year: 'numeric',
						month: '2-digit',
						day: '2-digit'
					})}, ${timePickerValue}`
				})
			})
		}
	})

	$effect(() => {
		if (maskValue) {
			const [date, time] = maskValue.split(', ')
			const [year, month, day] = date.split('-').map(Number)
			const validYear = Math.min(9999, Math.max(0, year))
			const validMonth = month ? Math.min(12, Math.max(1, month)) : 1
			const validDay = day ? Math.min(31, Math.max(1, day)) : 1
			untrack(() => {
				const datePart = `${String(validYear).padStart(4, '0')}-${String(validMonth).padStart(2, '0')}-${String(validDay).padStart(2, '0')}`
				datePickerValue = new Date(`${datePart}, 00:00:00`)
				if (time && time.trim()) {
					const [hour, minute] = time.split(':').map(Number)
					const validHour = Math.min(23, Math.max(0, hour))
					const validMinute = minute ? Math.min(59, Math.max(0, minute)) : 0
					if (!timeInputRef) return
					const timePart = `${String(validHour).padStart(2, '0')}:${String(validMinute).padStart(2, '0')}`
					timeInputRef.value = timePart
					parsedValue = `${datePart}, ${timePart}`
				} else {
					parsedValue = datePart
				}
			})
		}
	})

	$effect(() => {
		value = parsedValue
	})

	const onSelectDate = (date: Date | null) => {
		if (date) {
			// we get back only the date, we need to add the time from timePickerValue
			if (timePickerValue) {
				date.setHours(Number(timePickerValue.split(':')[0]))
				date.setMinutes(Number(timePickerValue.split(':')[1]))
			}
			maskValue = date.toLocaleString('en-CA', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit',
				hour: '2-digit',
				minute: '2-digit',
				hour12: false
			})
		} else {
			maskValue = ''
			timePickerValue = ''
		}
	}

	const onSelectTime = async () => {
		onTimeInputBlur()
		await tick()
		onStopTyping?.(parsedValue)
		isPickerOpen = false
		onSelect?.(parsedValue)
	}
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
				onSelect={onSelectDate}
				onConfirm={(date) => {
					onSelectDate(date)
					onSelectTime()
				}}
			>
				<TextInput
					bind:inputRef={timeInputRef}
					bind:value={timePickerValue}
					maskitoOptions={maskitoTimeOptions}
					placeholder="HH:MM"
					classContainer="mx-auto w-fit"
					classInput="w-20 text-center text-sm tracking-widest font-semibold"
					onblur={onTimeInputBlur}
					onkeydown={async (e: KeyboardEvent) => {
						e.stopPropagation()
						if (e.key === 'Enter') {
							e.preventDefault()
							onSelectTime()
						}
					}}
				/>
			</DatePicker>
		</div>
	{/if}
</div>
