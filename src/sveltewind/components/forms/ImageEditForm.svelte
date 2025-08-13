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
	import { SolidButton } from '../buttons'
	import { Alert } from '../display'
	import { XMarkIcon, CheckIcon } from '../../icons'
	import { getPickerPosition } from '../../utils'
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
		successMessage,
		onSuccess,
		classForm,
		classValue,
		...restInputProps
	}: Props = $props()

	let image = $state() as File
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
		formState.reset()
		image = null as unknown as File
		await tick()
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
			await tick()
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
				await tick()
			} else if (result.type === 'success') {
				// upload the image to the signed url
				try {
					const uploadURL = result.data as unknown as string
					const response = await fetch(uploadURL, {
						method: 'PUT',
						headers: {
							'Content-Type': image.type
						},
						body: image
					})
					if (!response.ok) {
						formState.errors = ['Failed to upload image']
						return
					}
					closeEdit()
					if (successMessage) {
						toastState.add(SuccessToast, {
							snippetProps: { message: successMessage },
							position: 'top-center'
						})
					}
					onSuccess?.()
				} catch (error) {
					if (error instanceof Error) {
						formState.errors = [error.message]
					} else {
						formState.errors = ['Failed to upload image']
					}
				}
			} else if (result.type === 'error') {
				formState.errors = [result.error.message]
			} else if (result.type === 'redirect') {
				goto(result.location)
			}
		}
	}

	let fileInputRef = $state() as HTMLInputElement

	const onFileSelected = (e: Event) => {
		formState.errors = []
		const target = e.target as HTMLInputElement & { files: FileList }
		image = target.files[0]
		if (image) {
			// limit image size to 5MB
			if (image.size > 5000000) {
				formState.errors = ['Image size should be less than 5MB']
				image = null as unknown as File
				return
			}
			formState.value = URL.createObjectURL(image)
			fileInputRef.value = ''
		} else {
			fileInputRef.value = ''
			formState.value = null
		}
	}
</script>

{#if label || labelSnippet}
	<span
		class={twMerge(
			'text-xs font-bold text-gray-900',
			isRequired && 'after:ml-1 after:text-red-500  after:content-["*"]',
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
{/if}
<div
	onclick={async () => {
		if (isDisabled) return
		await tick()
		fileInputRef.click()
	}}
	onkeydown={async (e) => {
		if (isDisabled) return
		// only allow Enter or Space to trigger editing
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			await tick()
			fileInputRef.click()
		}
	}}
	tabindex="0"
	role="button"
	class={twMerge(
		'hover:bg-textInput/10 focus:ring-textInput relative flex w-full cursor-pointer flex-col justify-between rounded-md px-3 py-2 ring-1 ring-gray-300 focus:ring-2 focus:outline-none',
		isDisabled && 'cursor-not-allowed',
		classForm
	)}
>
	<div class="flex items-center gap-1 text-sm">
		<div id="content" class={twMerge('h-fit w-full', classValue)}>
			{#if valueSnippet}
				{@render valueSnippet()}
			{:else if formState.value}
				<img alt={label} class="size-32 rounded-full" src={formState.value} />
			{:else}
				<span class="text-xs text-gray-300">
					<svg
						class="size-32 text-gray-300"
						viewBox="0 0 24 24"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							fill-rule="evenodd"
							d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
							clip-rule="evenodd"
						/>
					</svg>
				</span>
			{/if}
		</div>
	</div>
</div>

<form
	bind:this={formRef}
	enctype="multipart/form-data"
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
	<input
		class="sr-only"
		type="file"
		accept=".jpg, .jpeg, .png"
		onchange={onFileSelected}
		bind:this={fileInputRef}
		{name}
		required={isRequired}
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
