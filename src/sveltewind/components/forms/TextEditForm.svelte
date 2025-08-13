<script lang="ts" module>
	import { tick, type Snippet } from 'svelte'
	import type { Props as TextInputProps } from '../inputs/TextInput.svelte'
	import type { SubmitFunction } from '@sveltejs/kit'

	export type Props = TextInputProps & {
		action: string
		valueSnippet?: Snippet
		additionalFormData?: Record<string, string>
		hideCopyButton?: boolean
		successMessage?: string
		onSuccess?: () => void
		classForm?: string
		classValue?: string
	}
</script>

<script lang="ts">
	import { SolidButton, ClipboardButton } from '../buttons'
	import { Alert } from '../display'
	import { XMarkIcon, CheckIcon } from '../../icons'
	import { getPickerPosition } from '../../utils'
	import { TextInput } from '../inputs'
	import { clickOutside } from '../../actions'

	import { SuccessToast } from '../toasts'
	import { toastState } from '../display/Toast.svelte'

	import { fly } from 'svelte/transition'
	import { cubicInOut } from 'svelte/easing'
	import { untrack } from 'svelte'

	import { twMerge } from 'tailwind-merge'
	import { goto } from '$app/navigation'
	import { enhance } from '$app/forms'

	let {
		name,
		isRequired,
		isDisabled,
		label,
		labelSnippet,
		classLabel,
		value,
		valueSnippet,
		action,
		additionalFormData = {},
		hideCopyButton = false,
		successMessage,
		onSuccess,
		classForm,
		classValue,
		...restInputProps
	}: Props = $props()

	let isEditing = $state(false)
	let containerRef = $state() as HTMLElement
	let formRef = $state() as HTMLFormElement
	let pickerRef = $state() as HTMLElement
	let pickerLeftPosition = $state() as number | null
	let pickerTopPosition = $state() as number | null
	let showCopyButton = $state(false)

	$effect(() => {
		;({ pickerLeftPosition, pickerTopPosition } = getPickerPosition(formRef, pickerRef))
	})

	function flyAutoPosition(node: HTMLElement) {
		untrack(() => {
			;({ pickerLeftPosition, pickerTopPosition } = getPickerPosition(formRef, pickerRef))
		})

		return fly(node, {
			duration: 300,
			easing: cubicInOut
		})
	}

	$effect(() => {
		// prevent any scrolling when value changed
		const stopScrolling = (e: Event) => {
			if (formState.value !== value) {
				e.preventDefault()
			}
		}
		if (formState.value === value) return
		window.addEventListener('wheel', stopScrolling, { passive: false })
		window.addEventListener('touchmove', stopScrolling, { passive: false })
		return () => {
			window.removeEventListener('wheel', stopScrolling)
			window.removeEventListener('touchmove', stopScrolling)
		}
	})

	let inputRef = $state() as HTMLInputElement
	let formState = $state({
		value: value,
		isLoading: false,
		errors: [] as string[],
		reset: () => {
			formState.value = value
			formState.isLoading = false
			formState.errors = []
		}
	})

	$effect(() => {
		formState.reset()
	})

	const closeEdit = async () => {
		isEditing = false
		formState.reset()
		await tick()
		containerRef?.focus()
	}

	const onSubmit: SubmitFunction = async ({ formData }) => {
		// ignore if value is not changed
		if (formState.value === value) {
			closeEdit()
			return
		}
		formState.isLoading = true
		if (formState.errors.length) {
			formState.errors = []
			isEditing = false
			await tick()
			isEditing = true
		}
		// append additionalFormData to formData
		if (additionalFormData) {
			Object.entries(additionalFormData).forEach(([key, value]) => {
				formData.append(key, value as string)
			})
		}
		return async ({ result, update }) => {
			await update()
			formState.isLoading = false
			if (result.type === 'failure') {
				formState.errors = result.data?.errors
				isEditing = false
				await tick()
				isEditing = true
			} else if (result.type === 'success') {
				closeEdit()
				if (successMessage) {
					toastState.add(SuccessToast, {
						snippetProps: { message: successMessage },
						position: 'top-center'
					})
				}
				onSuccess?.()
			} else if (result.type === 'error') {
				formState.errors = [result.error.message]
			} else if (result.type === 'redirect') {
				goto(result.location)
			}
		}
	}

	const containerID = name + String(Date.now() + Math.random()) // used for copy button
</script>

{#if !isEditing}
	<div
		bind:this={containerRef}
		onclick={async () => {
			if (isDisabled) return
			isEditing = true
			showCopyButton = false
			await tick()
			inputRef.focus()
		}}
		onkeydown={async (e) => {
			if (isDisabled) return
			// only allow Enter or Space to trigger editing
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault()
				isEditing = true
				showCopyButton = false
				await tick()
				inputRef.focus()
			}
		}}
		tabindex="0"
		role="button"
		class={twMerge(
			'hover:bg-textInput/10 focus:ring-textInput relative flex w-full cursor-pointer flex-col justify-between rounded-md px-3 py-2 ring-1 ring-gray-300 focus:ring-2 focus:outline-none',
			isDisabled && 'cursor-not-allowed',
			classForm
		)}
		onmouseenter={() => (showCopyButton = true)}
		onmouseleave={() => (showCopyButton = false)}
	>
		<span
			class={twMerge(
				'text-xs font-bold text-slate-400',
				isRequired && 'after:ml-1 after:text-red-400  after:content-["*"]',
				classLabel,
				!label && !labelSnippet && 'sr-only'
			)}
		>
			{#if labelSnippet}
				{@render labelSnippet()}
			{:else}
				{label || name}
			{/if}
		</span>
		<div class="flex items-center gap-1 text-sm text-white">
			<div id={containerID} class={twMerge('h-fit w-full', classValue)}>
				{#if valueSnippet}
					{@render valueSnippet()}
				{:else if value}
					{value}
				{:else}
					<span class="text-xs text-slate-500"> - </span>
				{/if}
			</div>
			{#if value && showCopyButton && !hideCopyButton}
				<ClipboardButton {containerID} class="text-textInput/80 absolute right-2" />
			{/if}
		</div>
	</div>
{/if}

{#if isEditing}
	<form
		bind:this={formRef}
		class={twMerge('relative w-full', classForm)}
		method="POST"
		{action}
		use:enhance={onSubmit}
		use:clickOutside={() => {
			if (formState.value === value) {
				closeEdit()
			}
		}}
	>
		<TextInput
			bind:inputRef
			bind:value={formState.value}
			error={formState.errors.length > 0}
			{name}
			{isRequired}
			{label}
			{labelSnippet}
			{classLabel}
			autocomplete="off"
			{...restInputProps}
		/>
		{#if formState.value !== value}
			<div
				class="fixed z-20 max-w-96 min-w-60"
				style:top={pickerTopPosition + 'px'}
				style:left={pickerLeftPosition + 'px'}
				bind:this={pickerRef}
				in:flyAutoPosition
			>
				{#each formState.errors as error (error)}
					<Alert type="error" class="text-xs" hideIcon>{error}</Alert>
				{/each}
				<div
					class="mx-auto flex items-center justify-center gap-3 rounded-md bg-slate-500/50 px-3 py-2 shadow-lg backdrop-blur-lg"
				>
					<SolidButton
						onclick={closeEdit}
						class="h-fit gap-1 px-2 py-1"
						--color-solidButton="var(--color-slate-600)"
						isDisabled={formState.isLoading}
					>
						{#if !formState.isLoading}
							<XMarkIcon />
						{/if}
						Cancel
					</SolidButton>
					<SolidButton
						type="submit"
						class="h-fit gap-1 px-2 py-1"
						isLoading={formState.isLoading}
						isDisabled={formState.value === value}
					>
						{#if !formState.isLoading}
							<CheckIcon />
						{/if}
						Submit
					</SolidButton>
				</div>
			</div>
		{/if}
	</form>
{/if}
