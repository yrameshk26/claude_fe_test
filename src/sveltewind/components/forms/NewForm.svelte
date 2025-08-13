<script lang="ts" module>
	import type { SubmitFunction } from '@sveltejs/kit'
	import type { Snippet } from 'svelte'

	type Props = {
		trigger: Snippet<[{ onclick: () => void }]>
		action: string
		fields?: Snippet<[onClose?: () => void]>
		label?: string
		labelSnippet?: Snippet
		enctype?: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain'
		additionalFormData?: Record<string, string | number | boolean | File>
		onClose?: () => void
		successMessage?: string
		onSuccess?: () => void
		classForm?: string
		classLabel?: string
		classSubmitButton?: string
		classCancelButton?: string
	}
</script>

<script lang="ts">
	let {
		trigger,
		action,
		fields,
		label,
		labelSnippet,
		enctype,
		additionalFormData,
		onClose: onFormClose,
		successMessage,
		onSuccess,
		classForm,
		classLabel,
		classSubmitButton,
		classCancelButton
	}: Props = $props()

	import { enhance } from '$app/forms'
	import { goto } from '$app/navigation'
	import { twMerge } from 'tailwind-merge'

	import { dialogState } from '../display/Dialog.svelte'
	import { Alert } from '../display'
	import { SolidButton, GhostButton } from '../buttons'

	import { SuccessToast } from '../toasts'
	import { toastState } from '../display/Toast.svelte'

	const id = String(Date.now() + Math.random()) // used to target form

	let formState = $state({
		isLoading: false,
		errors: [] as string[],
		reset: () => {
			formState.isLoading = false
			formState.errors = []
		}
	})

	$effect(() => {
		formState.reset()
	})

	function onClose() {
		formState.reset()
		dialogState.close()
		onFormClose?.()
	}

	const onSubmit: SubmitFunction = async ({ formData }) => {
		formState.isLoading = true
		formState.errors = []
		// append additionalFormData to formData
		if (additionalFormData) {
			Object.entries(additionalFormData).forEach(([key, value]) => {
				formData.append(key, value as string)
			})
		}
		// remove undefined values from formData
		for (const [key, value] of [...formData.entries()]) {
			if (value === undefined || value === '' || value === null) {
				formData.delete(key)
			}
		}
		return async ({ result, update }) => {
			await update()
			formState.isLoading = false
			if (result.type === 'failure') {
				formState.errors = result.data?.errors
			} else if (result.type === 'success') {
				if (successMessage) {
					toastState.add(SuccessToast, {
						snippetProps: { message: successMessage },
						position: 'top-center'
					})
				}
				onSuccess?.()
				onClose()
			} else if (result.type === 'redirect') {
				onClose()
				await goto(result.location)
				onSuccess?.()
			} else if (result.type === 'error') {
				formState.errors = [result.error.message]
			}
		}
	}
</script>

{#snippet formSnippet()}
	<form
		method="POST"
		{action}
		use:enhance={onSubmit}
		{enctype}
		class={twMerge(
			'flex w-full max-w-md flex-col gap-4 overflow-auto rounded-md bg-white p-6',
			classForm
		)}
	>
		{#if labelSnippet}
			{@render labelSnippet()}
		{:else}
			<p class={twMerge('text-lg font-semibold', classLabel)}>{label || 'Form'}</p>
		{/if}

		{#if fields}
			{@render fields(onClose)}
		{/if}

		{#each formState.errors as error (error)}
			<Alert type="error">{error}</Alert>
		{/each}

		<div class="flex flex-1 items-end gap-4 self-end pt-4">
			<GhostButton
				onclick={onClose}
				isDisabled={formState.isLoading}
				class={twMerge('h-fit', classCancelButton)}>Cancel</GhostButton
			>
			<SolidButton
				{id}
				type="submit"
				isLoading={formState.isLoading}
				class={twMerge('h-fit', classSubmitButton)}>Submit</SolidButton
			>
		</div>
	</form>
{/snippet}

{@render trigger({
	onclick: () => dialogState.add(formSnippet)
})}
