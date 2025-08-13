<script lang="ts" module>
	import { tick, type Snippet } from 'svelte'
	import type { Props as ToggleInputProps } from '../inputs/ToggleInput.svelte'
	import type { SubmitFunction } from '@sveltejs/kit'

	export type Props = ToggleInputProps & {
		action: string
		valueSnippet?: Snippet
		additionalFormData?: Record<string, string>
		successMessage?: string
		onSuccess?: () => void
		classForm?: string
		classValue?: string
	}
</script>

<script lang="ts">
	import { SolidButton } from '../buttons'
	import { Alert } from '../display'
	import { XMarkIcon, CheckIcon } from '../../icons'
	import { getPickerPosition } from '../../utils'
	import { ToggleInput } from '../inputs'
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
		onToggle,
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
			if (value !== undefined && formState.value !== value) {
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

	let formState = $state({
		value: !!value,
		isLoading: false,
		errors: [] as string[],
		reset: () => {
			formState.value = !!value
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
				onToggle?.(formState.value)
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
</script>

{#if !isEditing}
	<div
		bind:this={containerRef}
		onclick={() => {
			if (isDisabled) return
			isEditing = true
			if (!valueSnippet) {
				formState.value = !formState.value
			}
		}}
		onkeydown={(e) => {
			if (isDisabled) return
			// only allow Enter or Space to trigger editing
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault()
				isEditing = true
				if (!valueSnippet) {
					formState.value = !formState.value
				}
			}
		}}
		tabindex="0"
		role="button"
		class={twMerge(
			'hover:bg-textInput/10 focus:ring-textInput flex cursor-pointer flex-col justify-between rounded-md px-3 py-1 ring-1 ring-gray-300 focus:ring-2 focus:outline-none',
			isDisabled && 'cursor-not-allowed',
			classForm
		)}
	>
		<span
			class={twMerge(
				'text-xs font-bold text-gray-900',
				isRequired && 'after:ml-1 after:text-red-500  after:content-["*"]',
				classLabel,
				!label && !labelSnippet && 'hidden'
			)}
		>
			{#if labelSnippet}
				{@render labelSnippet()}
			{:else}
				{label || name}
			{/if}
		</span>
		<div class="flex items-center gap-1 text-sm">
			<div id="content" class={twMerge('w-full', classValue)}>
				{#if valueSnippet}
					{@render valueSnippet()}
				{:else}
					<div
						class={twMerge(
							'relative mt-0.5 inline-flex h-6 w-11 flex-shrink-0  cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:cursor-not-allowed',
							!value && 'bg-gray-200',
							value && 'bg-textInput'
						)}
					>
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
					</div>
				{/if}
			</div>
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
		<ToggleInput
			bind:value={formState.value}
			error={formState.errors.length > 0}
			{name}
			{isRequired}
			{label}
			{labelSnippet}
			{classLabel}
			{onToggle}
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
