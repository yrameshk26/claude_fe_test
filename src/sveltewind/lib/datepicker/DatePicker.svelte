<script lang="ts" module>
	import type { Locale } from './locale.js'
	import type { Snippet } from 'svelte'

	type Props = {
		value: Date | null // Date value. It's `null` if no date is selected
		min?: Date // The earliest year the user can select
		max?: Date // The latest year the user can select
		locale?: Locale // Locale object for internationalization
		browseWithoutSelecting?: boolean // Wait with updating the date until a date is selected
		onSelect?: (date: Date | null) => void // Callback function when a date is selected
		onConfirm?: (date: Date | null) => void // Callback function when a date is confirmed
		children?: Snippet
	}
</script>

<script lang="ts">
	import { ChevronLeftIcon, ChevronRightIcon } from '../../icons'
	import { GhostButton, SolidButton } from '../../components/buttons'

	import { getMonthLength, getCalendarDays, type CalendarDay } from './utils.js'
	import { getInnerLocale } from './locale.js'
	import { twMerge } from 'tailwind-merge'

	const todayDate = new Date()

	let {
		value = $bindable(null),
		min = new Date(todayDate.getFullYear() - 100, 0, 1),
		max = new Date(todayDate.getFullYear() + 10, 11, 31, 23, 59, 59, 999),
		locale = {},
		browseWithoutSelecting = false,
		onSelect,
		onConfirm,
		children
	}: Props = $props()

	$effect(() => {
		// set min max times
		min.setHours(0, 0, 0, 0)
		max.setHours(23, 59, 59, 999)
	})

	// show presets for quick selection
	const presets = [
		{ label: 'Today', value: todayDate },
		{ label: 'Yesterday', value: new Date(todayDate.getTime() - 86400000) },
		{ label: 'Tomorrow', value: new Date(todayDate.getTime() + 86400000) },
		{ label: 'Last week', value: new Date(todayDate.getTime() - 604800000) },
		{ label: 'Next week', value: new Date(todayDate.getTime() + 604800000) },
		{
			label: 'Last month',
			value: new Date(todayDate.getFullYear(), todayDate.getMonth() - 1, todayDate.getDate())
		},
		{
			label: 'Next month',
			value: new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, todayDate.getDate())
		}
	]

	$effect(() => {
		if (value && value > max) {
			setValue(max)
		} else if (value && value < min) {
			setValue(min)
		}
	})

	function cloneDate(d: Date) {
		return new Date(d.getTime())
	}

	function setValue(d: Date) {
		if (d.getTime() !== value?.getTime()) {
			browseDate = clamp(d, min, max)
			value = cloneDate(browseDate)
		}
	}

	function setValueDate(d: Date) {
		if (d.getTime() !== value?.getTime()) {
			browseDate = clampDate(d, min, max)
			value = cloneDate(browseDate)
		}
	}

	/** Set the browseDate */
	function browse(d: Date) {
		browseDate = clampDate(d, min, max)
		if (!browseWithoutSelecting && value) {
			setValue(browseDate)
		}
	}

	function clamp(d: Date, min: Date, max: Date) {
		if (d > max) {
			return cloneDate(max)
		} else if (d < min) {
			return cloneDate(min)
		} else {
			return cloneDate(d)
		}
	}

	function clampDate(d: Date, min: Date, max: Date) {
		const limit = clamp(d, min, max)
		if (limit.getTime() !== d.getTime()) {
			d = new Date(
				limit.getFullYear(),
				limit.getMonth(),
				limit.getDate(),
				d.getHours(),
				d.getMinutes(),
				d.getSeconds(),
				d.getMilliseconds()
			)
			d = clamp(d, min, max)
		}
		return d
	}

	/** The date shown in the popup when none is selected */
	let browseDate = $state(value ? cloneDate(value) : cloneDate(clampDate(todayDate, min, max)))

	// Reset the browseDate whenever the value changes
	$effect(() => {
		setBrowseDate(value)
	})

	function setBrowseDate(value: Date | null) {
		if (browseDate.getTime() !== value?.getTime()) {
			browseDate = value ? cloneDate(value) : browseDate
		}
	}

	let years = $derived(getYears(min, max))
	function getYears(min: Date, max: Date) {
		let years = [] as number[]
		for (let i = min.getFullYear(); i <= max.getFullYear(); i++) {
			years.push(i)
		}
		return years
	}

	let iLocale = $derived(getInnerLocale(locale))
	let browseYear = $derived(browseDate.getFullYear())

	function setYear(newYear: number) {
		browseDate.setFullYear(newYear)
		browse(browseDate)
	}

	let browseMonth = $derived(browseDate.getMonth())
	function setMonth(newMonth: number) {
		let newYear = browseDate.getFullYear()
		if (newMonth === 12) {
			newMonth = 0
			newYear++
		} else if (newMonth === -1) {
			newMonth = 11
			newYear--
		}

		const maxDate = getMonthLength(newYear, newMonth)
		const newDate = Math.min(browseDate.getDate(), maxDate)
		browse(
			new Date(
				newYear,
				newMonth,
				newDate,
				browseDate.getHours(),
				browseDate.getMinutes(),
				browseDate.getSeconds(),
				browseDate.getMilliseconds()
			)
		)
	}

	let calendarDays = $derived(getCalendarDays(browseDate, iLocale.weekStartsOn))

	function selectDay(calendarDay: CalendarDay) {
		if (dayIsInRange(calendarDay, min, max)) {
			browseDate.setFullYear(0)
			browseDate.setMonth(0)
			browseDate.setDate(1)
			browseDate.setFullYear(calendarDay.year)
			browseDate.setMonth(calendarDay.month)
			browseDate.setDate(calendarDay.number)
			browseDate.setHours(0, 0, 0, 0)
			setValueDate(browseDate)
			onSelect?.(cloneDate(browseDate))
		}
	}

	function dayIsInRange(calendarDay: CalendarDay, min: Date, max: Date) {
		const date = new Date(calendarDay.year, calendarDay.month, calendarDay.number)
		date.setHours(0, 0, 0, 0)
		const minDate = new Date(min.getFullYear(), min.getMonth(), min.getDate())
		minDate.setHours(0, 0, 0, 0)
		const maxDate = new Date(max.getFullYear(), max.getMonth(), max.getDate())
		maxDate.setHours(23, 59, 59, 999)
		return date >= minDate && date <= maxDate
	}

	function shiftKeydown(e: KeyboardEvent) {
		if (e.shiftKey && e.key === 'ArrowUp') {
			setYear(browseDate.getFullYear() - 1)
		} else if (e.shiftKey && e.key === 'ArrowDown') {
			setYear(browseDate.getFullYear() + 1)
		} else if (e.shiftKey && e.key === 'ArrowLeft') {
			setMonth(browseDate.getMonth() - 1)
		} else if (e.shiftKey && e.key === 'ArrowRight') {
			setMonth(browseDate.getMonth() + 1)
		} else {
			return false
		}
		e.preventDefault()
		return true
	}

	function yearKeydown(e: KeyboardEvent) {
		let shift = e.shiftKey || e.altKey
		if (shift) {
			shiftKeydown(e)
			return
		} else if (e.key === 'ArrowUp') {
			setYear(browseDate.getFullYear() - 1)
		} else if (e.key === 'ArrowDown') {
			setYear(browseDate.getFullYear() + 1)
		} else if (e.key === 'ArrowLeft') {
			setMonth(browseDate.getMonth() - 1)
		} else if (e.key === 'ArrowRight') {
			setMonth(browseDate.getMonth() + 1)
		} else {
			shiftKeydown(e)
			return
		}
		e.preventDefault()
	}

	function monthKeydown(e: KeyboardEvent) {
		let shift = e.shiftKey || e.altKey
		if (shift) {
			shiftKeydown(e)
			return
		} else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
			setMonth(browseDate.getMonth() - 1)
		} else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
			setMonth(browseDate.getMonth() + 1)
		} else {
			shiftKeydown(e)
			return
		}
		e.preventDefault()
	}

	function keydown(e: KeyboardEvent) {
		let shift = e.shiftKey || e.altKey
		if (
			(e.target as HTMLElement)?.tagName === 'SELECT' ||
			(e.target as HTMLElement)?.tagName === 'SPAN'
		) {
			// Ignore date/month <select> & TimePicker <input>
			return
		}
		if (shift) {
			shiftKeydown(e)
			return
		} else if (e.key === 'ArrowUp') {
			browseDate = new Date(
				browseDate.getFullYear(),
				browseDate.getMonth(),
				browseDate.getDate() - 7
			)
			setValueDate(browseDate)
		} else if (e.key === 'ArrowDown') {
			browseDate = new Date(
				browseDate.getFullYear(),
				browseDate.getMonth(),
				browseDate.getDate() + 7
			)
			setValueDate(browseDate)
		} else if (e.key === 'ArrowLeft') {
			browseDate = new Date(
				browseDate.getFullYear(),
				browseDate.getMonth(),
				browseDate.getDate() - 1
			)
			setValueDate(browseDate)
		} else if (e.key === 'ArrowRight') {
			browseDate = new Date(
				browseDate.getFullYear(),
				browseDate.getMonth(),
				browseDate.getDate() + 1
			)
			setValueDate(browseDate)
		} else if (e.key === 'Enter') {
			setValue(browseDate)
			if (onSelect) {
				onSelect(cloneDate(browseDate))
			}
			e.stopPropagation()
		} else {
			return
		}
		e.preventDefault()
	}
</script>

<div
	class="focus:ring-textInput/30 border-0.5 inline-block cursor-default rounded-md border-gray-500/50 bg-white p-2 pt-3 text-xs shadow-xl transition-all select-none focus:ring-1 focus:outline-0"
	tabindex={0}
	onkeydown={keydown}
	role="button"
>
	<div class="outline-0">
		<div class="flex items-center justify-center px-1 pb-2">
			<GhostButton class="p-1" tabindex={-1} onclick={() => setMonth(browseDate.getMonth() - 1)}>
				<ChevronLeftIcon class="text-slate-900" />
			</GhostButton>
			<div class="relative mx-1 flex grow">
				<select
					value={browseYear}
					onkeydown={yearKeydown}
					oninput={(e) => setYear(parseInt(e.currentTarget.value))}
					class="focus-within:ring-textInput block w-full rounded-md border-0 py-1.5 pr-8 ring-1 ring-gray-300 transition-all focus-within:ring-2 focus-within:outline-0"
				>
					{#each years as v (v)}
						<option value={v}>{v}</option>
					{/each}
				</select>
			</div>
			<div class="relative mx-1 flex grow">
				<select
					value={browseMonth}
					onkeydown={monthKeydown}
					oninput={(e) => setMonth(parseInt(e.currentTarget.value))}
					class="focus-within:ring-textInput block w-full rounded-md border-0 py-1.5 pr-8 ring-1 ring-gray-300 transition-all focus-within:ring-2 focus-within:outline-0"
				>
					{#each iLocale.months as monthName, i (monthName)}
						<option
							disabled={new Date(browseYear, i, getMonthLength(browseYear, i), 23, 59, 59, 999) <
								min || new Date(browseYear, i) > max}
							value={i}>{monthName}</option
						>
					{/each}
				</select>
			</div>

			<GhostButton class="p-1" tabindex={-1} onclick={() => setMonth(browseDate.getMonth() + 1)}>
				<ChevronRightIcon class="text-slate-900" />
			</GhostButton>
		</div>
		<div class="flex pb-0.5 font-semibold">
			{#each Array(7), i (i)}
				{#if i + iLocale.weekStartsOn < 7}
					<div class="w-9 text-center">
						{iLocale.weekdays[iLocale.weekStartsOn + i]}
					</div>
				{:else}
					<div class="w-9 text-center">
						{iLocale.weekdays[iLocale.weekStartsOn + i - 7]}
					</div>
				{/if}
			{/each}
		</div>
		{#each Array(6), weekIndex (weekIndex)}
			<div class="flex gap-1">
				{#each calendarDays.slice(weekIndex * 7, weekIndex * 7 + 7) as calendarDay (calendarDay)}
					{@const isDisabled = !dayIsInRange(calendarDay, min, max)}
					{@const isSelected =
						value &&
						calendarDay.year === value.getFullYear() &&
						calendarDay.month === value.getMonth() &&
						calendarDay.number === value.getDate()}
					{@const isToday =
						calendarDay.year === todayDate.getFullYear() &&
						calendarDay.month === todayDate.getMonth() &&
						calendarDay.number === todayDate.getDate()}
					{@const isOtherMonth = calendarDay.month !== browseMonth}
					<button
						type="button"
						tabindex={-1}
						onclick={() => {
							selectDay(calendarDay)
						}}
						class={twMerge(
							'hover:bg-textInput/10 my-[0.05rem] box-border flex h-[1.94rem] w-8  items-center justify-center rounded-[5px] border-2 border-solid border-transparent transition-colors',
							isDisabled && 'hidden',
							isSelected && 'bg-textInput border-textInput hover:bg-textInput/90 text-white',
							isToday && 'border-textInput/50 border-1',
							isOtherMonth && 'opacity-40'
						)}
					>
						<span>{calendarDay.number}</span>
					</button>
				{/each}
			</div>
		{/each}

		{#if children}
			{@render children()}
		{/if}

		<div class="mt-2 flex items-center gap-2">
			<select
				oninput={(e) => {
					browseDate = new Date(e.currentTarget.value)
					setValueDate(browseDate)
					onSelect?.(cloneDate(browseDate))
				}}
				class="focus-within:ring-textInput block w-full rounded-md border-0 py-1.5 pr-8 ring-1 ring-gray-300 transition-all focus-within:ring-2 focus-within:outline-0"
			>
				<option value="">Select</option>
				{#each presets as preset (preset)}
					<option value={preset.value}>{preset.label}</option>
				{/each}
			</select>
			<SolidButton
				--color-solidButton="var(--color-slate-600)"
				tabindex={-1}
				class="w-fit py-1.5"
				onclick={() => {
					onConfirm?.(cloneDate(browseDate))
				}}
			>
				Confirm
			</SolidButton>
		</div>
	</div>
</div>
