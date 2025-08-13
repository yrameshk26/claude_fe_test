<script lang="ts" module>
	import type { HTMLInputAttributes } from 'svelte/elements'
	import type { Snippet } from 'svelte'
	import type { MaskitoOptions } from '@maskito/core'

	export type SelectOption = {
		label: string
		value: string | number | null
		metadata?: Record<string, any>
	}

	export type Props = {
		name?: string
		label?: string
		labelSnippet?: Snippet
		options?: SelectOption[]
		loadMoreUrl?: string
		optionSnippet?: Snippet<[SelectOption]>
		onNewOption?: (value: string, handleSelect: (newOption: SelectOption) => void) => void
		values?: string[]
		mask?: MaskitoOptions['mask']
		placeholder?: string
		error?: string | boolean
		onSelect?: (options: SelectOption[] | null) => void
		inputProps?: HTMLInputAttributes
		hideIcon?: boolean
		isRequired?: boolean
		isReadOnly?: boolean
		isDisabled?: boolean
		hideDisabledIcon?: boolean
		isInitiallyOpen?: boolean
		classContainer?: string
		classLabel?: string
		classInputGroup?: string
		classInput?: string
		classDropdown?: string
		classDropdownItem?: string
		leftChildren?: Snippet<[{ close: () => void }]>
		rightChildren?: Snippet<[{ close: () => void }]>
		bottomChildren?: Snippet<[{ close: () => void }]>
		inputRef?: HTMLInputElement
	}
</script>

<script lang="ts">
	let {
		name = String(Date.now() + Math.random()),
		label,
		labelSnippet,
		options = [],
		loadMoreUrl = '',
		optionSnippet,
		onNewOption,
		values = $bindable([]),
		mask,
		placeholder = '',
		error = '',
		onSelect,
		inputProps = {},
		hideIcon = false,
		isRequired = false,
		isReadOnly = false,
		isDisabled = false,
		hideDisabledIcon = false,
		isInitiallyOpen = false,
		classContainer,
		classLabel,
		classInputGroup,
		classInput,
		classDropdown,
		classDropdownItem,
		leftChildren,
		rightChildren,
		bottomChildren,
		inputRef = $bindable() as HTMLInputElement
	}: Props = $props()

	import { tick, untrack } from 'svelte'
	import { fly } from 'svelte/transition'
	import { cubicInOut } from 'svelte/easing'

	import { twMerge } from 'tailwind-merge'
	import { Maskito } from '@maskito/core'

	import { page } from '$app/state'

	import { clickOutside, trapDropdown, stopTyping } from '../../actions'
	import { getPickerPosition } from '../../utils'
	import {
		ChevronUpDownIcon,
		LoadingIcon,
		ClearIcon,
		NoSymbolIcon,
		PlusIcon,
		CheckIcon
	} from '../../icons'
	import { GhostButton } from '../buttons'
	import { Alert } from '../display'

	const id = name + String(Date.now() + Math.random()) // used for aria attributes

	let isOptionsOpen = $state(false)
	let isLoading = $state(false)

	// local values and options
	let localValues = $state(values)
	let localOptions = $state(options)

	const getInputTextValue = () => {
		return localValues.length === 1
			? localOptions.find((option) => option.value === localValues[0])?.label || ''
			: localValues.length <= 3
				? localOptions
						.filter((option) => [...localValues].includes(option.value as string))
						.map((option) => option.label)
						.join(', ')
				: localValues.length > 3
					? localOptions
							.filter((option) => [...localValues].includes(option.value as string))
							.slice(0, 3)
							.map((option) => option.label)
							.join(', ') +
						' and ' +
						(localValues.length - 3) +
						' more'
					: ''
	}

	let searchValue = $state(getInputTextValue())
	let inputBindValue = $state(values.join(','))

	$effect(() => {
		untrack(() => {
			if (isInitiallyOpen) {
				onInputActivate()
			}
		})
	})

	$effect(() => {
		if (!mask) return
		const maskedInput = new Maskito(inputRef, { mask })
		return () => {
			maskedInput.destroy()
		}
	})

	$effect(() => {
		// load initial options if loadMoreUrl is provided and options is empty
		untrack(() => {
			if (loadMoreUrl && localOptions.length === 0) {
				loadMore()
			}
		})
	})

	let filteredOptions = $derived(
		localOptions.filter(
			(option) =>
				option.label.toLowerCase().trim().includes(searchValue.toLowerCase().trim()) ||
				JSON.stringify(option.metadata || {})
					.toLowerCase()
					.includes(searchValue.toLowerCase().trim())
		)
	)

	$effect(() => {
		if (dropdownRef && filteredOptions.length !== -1) {
			flyAutoPosition(dropdownRef)
		}
	})

	const handleSelect = async (option: SelectOption) => {
		const existingIndex = [...localValues].indexOf(option.value as never)
		if (existingIndex > -1) {
			localValues.splice(existingIndex, 1)
		} else {
			localValues.push(option.value as never)
		}
		await tick()
		inputBindValue = localValues.join(',')
		const selectedOptions = localOptions.filter((option) =>
			[...localValues].includes(option.value as never)
		)
		await tick()
		onSelect?.(selectedOptions)
		// inputRef.value = inputBindValue
		searchValue = ''
		// inputRef.focus()
		loadMore()
	}

	const handleClearAll = () => {
		localValues = []
		inputBindValue = ''
		searchValue = ''
		onSelect?.(null)
		inputRef.value = ''
		loadMore()
	}

	const onAddNew = () => {
		if (!onNewOption) return
		onNewOption(searchValue.trim(), async (option: SelectOption) => {
			localOptions = [option, ...localOptions]
			await tick()
			handleSelect(option)
		})
	}

	const close = () => {
		if (!isOptionsOpen) return
		isOptionsOpen = false
		// reset search value
		searchValue = getInputTextValue()
		// reset localOptions
		localOptions = [...options]
	}

	// Toggle the localOptions list on input activation
	const onInputActivate = async () => {
		if (!isOptionsOpen) {
			isOptionsOpen = true
			searchValue = ''
			loadMore()
			if (localValues.length > 0) {
				// sort the localOptions by the selected localValues first
				const selectedOptions = localOptions.filter((option) =>
					[...localValues].includes(option.value as never)
				)
				const unselectedOptions = localOptions.filter(
					(option) => ![...localValues].includes(option.value as never)
				)
				localOptions = [...selectedOptions, ...unselectedOptions]
			}
		}
	}

	const handleOnInputKeyUp = async (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			isOptionsOpen = false
			return
		}
		if (!isOptionsOpen && event.key !== 'Enter') {
			onInputActivate()
		} else {
			if (event.key === 'Enter' && isOptionsOpen) {
				event.preventDefault()
				event.stopPropagation()

				const matchingOptions = localOptions.filter(
					(option) =>
						!!searchValue &&
						option.label.toLowerCase().trim().includes(searchValue.toLowerCase().trim())
				)

				if (matchingOptions.length === 1) {
					handleSelect(matchingOptions[0])
					return
				}

				if (searchValue.toLowerCase().trim() && matchingOptions.length === 0 && onNewOption) {
					onAddNew()
					isOptionsOpen = false
					return
				}
			}
		}
	}

	const handleKeyUp = async (event: KeyboardEvent) => {
		if (
			event.key === 'ArrowUp' ||
			event.key === 'ArrowDown' ||
			event.key === 'Shift' ||
			event.key === 'Tab' ||
			event.key === 'Enter'
		) {
			return // let trapDropdown action handle this
		}
		if (isOptionsOpen) {
			inputRef.focus()
			if (!searchValue) {
				await tick()
				if (inputRef) {
					inputRef.value = event.key
				}
			}
			if (event.key === 'Escape') {
				isOptionsOpen = false
				return
			}
		} else {
			event.preventDefault()
			event.stopPropagation()
		}
	}

	let loadMoreCache = $state({}) as Record<string, SelectOption[]>
	const loadMore = () => {
		if (!loadMoreUrl) return
		if (loadMoreCache[searchValue]) {
			localOptions = [...loadMoreCache[searchValue]]
			// bring the selected options to the top
			const indices = localOptions.filter((option) => localValues.includes(option.value as never))
			if (indices.length > 0) {
				localOptions = [
					...indices,
					...localOptions.filter((option) => !localValues.includes(option.value as never))
				]
			}
			isLoading = false
			return
		} else {
			isLoading = true
			fetch(`${loadMoreUrl}?search=${searchValue}`)
				.then((res) => res.json())
				.then((res) => {
					// remove duplicates
					localOptions = [...localOptions, ...res].filter(
						(option, index, self) => index === self.findIndex((t) => t.value === option.value)
					)
					loadMoreCache[searchValue] = [...localOptions]
				})
				.finally(() => {
					isLoading = false
				})
		}
		// include the current value in the cache
		if (values.length > 0) {
			isLoading = true
			const url = new URL(page.url.origin + loadMoreUrl)
			url.searchParams.set('search', values.join(','))
			fetch(url)
				.then((res) => res.json())
				.then((res) => {
					// remove duplicates
					localOptions = [...localOptions, ...res].filter(
						(option, index, self) => index === self.findIndex((t) => t.value === option.value)
					)
					loadMoreCache[searchValue] = [...localOptions]
				})
				.finally(() => {
					isLoading = false
				})
		}
	}

	let dropdownRef = $state() as HTMLElement
	let dropdownLeftPosition = $state() as number | null
	let dropdownTopPosition = $state() as number | null

	$effect(() => {
		untrack(() => {
			if (!dropdownRef) return
			;({ pickerTopPosition: dropdownTopPosition, pickerLeftPosition: dropdownLeftPosition } =
				getPickerPosition(inputRef, dropdownRef))
		})
	})

	function flyAutoPosition(node: HTMLElement) {
		untrack(() => {
			;({ pickerTopPosition: dropdownTopPosition, pickerLeftPosition: dropdownLeftPosition } =
				getPickerPosition(inputRef, dropdownRef))
		})

		return fly(node, {
			duration: 200,
			easing: cubicInOut
		})
	}

	$effect(() => {
		// prevent any scrolling on all elements except the picker when the picker is open
		const stopScrolling = (e: Event) => {
			if (isOptionsOpen) {
				e.preventDefault()
				dropdownRef.addEventListener('wheel', (e) => {
					e.stopPropagation()
				})
				dropdownRef.addEventListener('touchmove', (e) => {
					e.stopPropagation()
				})
			}
		}
		if (!isOptionsOpen) return
		window.addEventListener('wheel', stopScrolling, { passive: false })
		window.addEventListener('touchmove', stopScrolling, { passive: false })
		return () => {
			window.removeEventListener('wheel', stopScrolling)
			window.removeEventListener('touchmove', stopScrolling)
			dropdownRef?.removeEventListener('wheel', (e) => e.stopPropagation())
			dropdownRef?.removeEventListener('touchmove', (e) => e.stopPropagation())
		}
	})
</script>

<div
	use:clickOutside={close}
	class={twMerge(
		'relative flex flex-col rounded-lg px-4 py-3 text-sm bg-slate-800/50 border border-slate-700 transition-all placeholder:text-slate-500 focus-within:border-slate-500 focus-within:bg-slate-800',
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
	<div class={twMerge('flex h-full items-center justify-between', classInputGroup)}>
		{#if leftChildren}
			{@render leftChildren({ close })}
		{/if}

		<input
			disabled={isDisabled}
			readonly={isReadOnly}
			{id}
			use:stopTyping={() => {
				searchValue = inputRef?.value || ''
				loadMore()
			}}
			placeholder={getInputTextValue() || placeholder}
			bind:this={inputRef}
			value={searchValue}
			onclick={onInputActivate}
			onkeyup={handleOnInputKeyUp}
			type="text"
			autocomplete="off"
			class={twMerge(
				'flex-1 appearance-none border-0 bg-transparent text-white placeholder:text-slate-500 placeholder:text-sm focus:outline-0 disabled:cursor-not-allowed',
				classInput
			)}
			role="combobox"
			aria-controls="options"
			aria-expanded={isOptionsOpen}
			{...inputProps}
		/>

		<input required={isRequired} {name} tabindex={-1} bind:value={inputBindValue} class="sr-only" />

		{#if localValues.length && !isDisabled && !isReadOnly && !isRequired}
			<GhostButton tabindex={-1} class="p-0.5" onclick={handleClearAll}>
				<ClearIcon />
			</GhostButton>
		{/if}

		{#if (isDisabled || isReadOnly) && !hideDisabledIcon}
			<NoSymbolIcon />
		{/if}

		{#if rightChildren}
			{@render rightChildren({ close })}
		{/if}

		{#if !hideIcon && !isDisabled && !isReadOnly}
			<GhostButton
				isDisabled={isDisabled || isReadOnly}
				onclick={isOptionsOpen ? close : onInputActivate}
				tabindex={-1}
				class="p-1"
			>
				<ChevronUpDownIcon />
				<span class="sr-only">Toggle options</span>
			</GhostButton>
		{/if}
	</div>
	{#if bottomChildren}
		{@render bottomChildren({ close })}
	{/if}
	{#if error && error !== true}
		<Alert type="error" class="mx-2.5 mt-1 mb-1 py-1 text-xs" classIcon="size-4">
			{error}
		</Alert>
	{/if}

	{#if isOptionsOpen}
		<div
			class={twMerge('fixed z-30')}
			style:top={dropdownTopPosition + 'px'}
			style:left={dropdownLeftPosition + 'px'}
			bind:this={dropdownRef}
			transition:flyAutoPosition
		>
			<div
				id="options"
				use:trapDropdown
				onkeyup={handleKeyUp}
				role="listbox"
				tabindex={-1}
				class={twMerge(
					'flex max-h-[24rem] min-w-40 flex-col gap-1 overflow-auto overscroll-contain rounded-md bg-white p-0.5 text-sm shadow-lg outline outline-1 outline-gray-300/50',
					classDropdown
				)}
			>
				{#if isLoading}
					<div class="text-textInput flex items-center gap-2 p-2">
						<LoadingIcon />
						<span>Loading ...</span>
					</div>
				{:else}
					{#each filteredOptions as option (option.value + option.label)}
						<GhostButton
							id={option.value + ''}
							tabindex={-1}
							onclick={() => handleSelect(option)}
							class={twMerge(
								'hover:bg-textInput/10 relative justify-start',
								[...localValues].includes(option.value as never) && 'bg-textInput/20 font-semibold',
								classDropdownItem
							)}
						>
							{#if [...localValues].includes(option.value as never) && option?.value}
								<span class="text-textInput absolute left-2 flex items-center">
									<CheckIcon />
								</span>
							{/if}
							<div
								class={twMerge(
									'block text-xs text-pretty',
									localValues.length > 0 && 'pl-6',
									classDropdownItem
								)}
							>
								{#if optionSnippet}
									{@render optionSnippet(option)}
								{:else}
									{option.label}
									{#if option.metadata?.subLabel}
										<div class="text-xs text-gray-500">
											{option.metadata.subLabel}
										</div>
									{/if}
								{/if}
							</div>
						</GhostButton>
					{:else}
						<Alert type="error" class="text-xs w-full">No options found</Alert>
						{#if onNewOption}
							<GhostButton onclick={onAddNew} class="justify-start px-2 text-xs">
								<PlusIcon />
								<span>{searchValue}</span>
							</GhostButton>
						{/if}
					{/each}
				{/if}
			</div>
		</div>
	{/if}
</div>
