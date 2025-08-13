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
		hiddenOptionValues?: (string | number | null)[]
		loadMoreUrl?: string
		optionSnippet?: Snippet<[SelectOption]>
		onNewOption?: (value: string, handleSelect: (newOption: SelectOption) => void) => void
		value?: string
		mask?: MaskitoOptions['mask']
		placeholder?: string
		error?: string | boolean
		onSelect?: (option: SelectOption) => void
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
		hiddenOptionValues = [],
		loadMoreUrl = '',
		optionSnippet,
		onNewOption,
		value = $bindable(),
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

	import { page } from '$app/state'

	const id = name + String(Date.now() + Math.random()) // used for aria attributes

	let isOptionsOpen = $state(false)
	let isLoading = $state(false)
	let searchValue = $state(options.find((option) => option.value === value)?.label || '')
	let placeholderText = $derived(
		options.find((option) => option.value === value)?.label || placeholder
	)

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
		if (options.length && !isOptionsOpen && !value) {
			// reset search value if no value is selected
			searchValue =
				options.find((option) => option.value === value || option.label === value)?.label || ''
		}
	})

	$effect(() => {
		// load initial options if loadMoreUrl is provided and options is empty
		untrack(() => {
			if (loadMoreUrl && options.length === 0) {
				loadMore()
			}
		})
	})

	let filteredOptions = $derived(
		options
			.filter(
				(option) =>
					option.label.toLowerCase().trim().includes(searchValue.toLowerCase().trim()) ||
					JSON.stringify(option.metadata || {})
						.toLowerCase()
						.includes(searchValue.toLowerCase().trim())
			)
			.filter((option) => !hiddenOptionValues.includes(option.value))
	)

	$effect(() => {
		if (dropdownRef && filteredOptions.length !== -1) {
			flyAutoPosition(dropdownRef)
		}
	})

	const handleSelect = async (option: SelectOption) => {
		onSelect?.(option)
		value = option.value as string
		searchValue = option.value ? option.label : ''
		inputRef.focus()
		close()
	}

	const onAddNew = () => {
		if (!onNewOption) return
		onNewOption(searchValue.trim(), async (option: SelectOption) => {
			options = [option, ...options]
			await tick()
			handleSelect(option)
		})
	}

	const close = () => {
		if (!isOptionsOpen) return
		isOptionsOpen = false
		// reset search value if no value is selected
		if (!value)
			searchValue =
				options.find((option) => option.value === value || option.label === value)?.label || ''
	}

	// Toggle the options list on input activation
	const onInputActivate = async () => {
		if (!isOptionsOpen) {
			isOptionsOpen = true
			searchValue = ''
			loadMore()
			if (value) {
				// focus the option with id option.label
				await tick()
				document.getElementById(value + '')?.focus()
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

				const matchingOptions = options.filter(
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
			event.key === 'Tab'
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
			options = [...loadMoreCache[searchValue]]
			// bring the selected option to the top
			const index = options.findIndex((option) => option.value === value)
			if (index !== -1) {
				options = [options[index], ...options.slice(0, index), ...options.slice(index + 1)]
			}
			isLoading = false
			return
		} else {
			isLoading = true
			const url = new URL(page.url.origin + loadMoreUrl)
			url.searchParams.set('search', searchValue)
			fetch(url)
				.then((res) => res.json())
				.then((res) => {
					// remove duplicates
					options = [...options, ...res].filter(
						(option, index, self) => index === self.findIndex((t) => t.value === option.value)
					)
					loadMoreCache[searchValue] = [...options]
				})
				.finally(() => {
					isLoading = false
				})
		}
		// include the current value in the cache
		if (value) {
			isLoading = true
			fetch(`${loadMoreUrl}?search=${value}`)
				.then((res) => res.json())
				.then((res) => {
					// remove duplicates
					loadMoreCache[searchValue] = []
					options = [...res, ...options, ...loadMoreCache[searchValue]].filter(
						(option, index, self) => index === self.findIndex((t) => t.value === option.value)
					)
					loadMoreCache[searchValue] = [...options]
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
		;({ pickerTopPosition: dropdownTopPosition, pickerLeftPosition: dropdownLeftPosition } =
			getPickerPosition(inputRef, dropdownRef))
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
		'focus-within:ring-textInput relative flex flex-col rounded-md py-1 text-sm ring-1 ring-gray-300 transition-all placeholder:text-xs focus-within:border-transparent focus-within:ring-2 focus-within:outline-2 focus-within:outline-transparent',
		error && 'ring-red-500',
		(isDisabled || isReadOnly) &&
			'cursor-not-allowed bg-gray-200/50 text-gray-500 hover:bg-gray-200/50 active:translate-y-0',
		classContainer
	)}
>
	<label
		for={id}
		class={twMerge(
			'px-3 text-xs font-bold text-gray-900',
			isRequired && 'after:ml-1 after:text-red-500 after:content-["*"]',
			classLabel,
			!label && !labelSnippet && 'sr-only',
			(isDisabled || isReadOnly) && 'cursor-not-allowed rounded-md bg-gray-100'
		)}
	>
		{#if labelSnippet}
			{@render labelSnippet()}
		{:else}
			{label || name}
		{/if}
	</label>
	<div class={twMerge('flex h-full items-center justify-between px-3', classInputGroup)}>
		{#if leftChildren}
			{@render leftChildren({ close })}
		{/if}

		<input
			disabled={isDisabled}
			readonly={isReadOnly}
			{id}
			use:stopTyping={() => {
				searchValue = inputRef.value || ''
				loadMore()
			}}
			autocomplete="off"
			required={isRequired}
			placeholder={placeholderText}
			bind:this={inputRef}
			value={searchValue}
			onclick={onInputActivate}
			onkeyup={handleOnInputKeyUp}
			type="text"
			class={twMerge(
				'flex-1 appearance-none border-0 placeholder:text-xs focus:outline-0 disabled:cursor-not-allowed',
				classInput
			)}
			role="combobox"
			aria-controls="options"
			aria-expanded={isOptionsOpen}
			{...inputProps}
		/>

		<input required={isRequired} {name} tabindex={-1} bind:value class="sr-only" />

		{#if value && !isDisabled && !isReadOnly && !isRequired}
			<GhostButton
				tabindex={-1}
				class="p-0.5"
				onclick={() => {
					handleSelect({ label: '', value: null })
				}}
			>
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
			class={twMerge('fixed z-50')}
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
					'flex max-h-[24rem] min-w-40 flex-col gap-1 overflow-auto overscroll-contain rounded-md bg-white p-0.5 text-sm shadow-lg outline-1 outline-gray-300/50',
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
						{@const isSelected = option.value === value}
						<GhostButton
							id={option.value + ''}
							tabindex={-1}
							onclick={() => handleSelect(option)}
							class={twMerge(
								'hover:bg-textInput/10 relative justify-start',
								isSelected && 'bg-textInput/20 font-semibold',
								classDropdownItem
							)}
						>
							{#if isSelected && option?.value}
								<span class="text-textInput absolute left-2 flex items-center">
									<CheckIcon />
								</span>
							{/if}
							<div
								class={twMerge('block text-xs text-pretty', !!value && 'pl-6', classDropdownItem)}
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
