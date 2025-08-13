<script lang="ts" module>
	import type { Snippet } from 'svelte'

	type DialogOptions = {
		position?: 'center' | 'top' | 'bottom'
		closeOnEscape?: boolean
		closeOnOverlay?: boolean
		snippetProps?: any
		onClose?: () => void
	}

	type Dialog = {
		id: string
		dialogContentSnippet: Snippet<[DialogOptions['snippetProps']]>
		options: DialogOptions
	}

	export const dialogState = $state({
		dialogs: [] as Dialog[],
		size: () => dialogState.dialogs.length,
		add: (
			dialogContentSnippet: Snippet<[DialogOptions['snippetProps']]>,
			dialogOptions: DialogOptions = {}
		) => {
			const {
				position = 'center',
				closeOnEscape = false,
				closeOnOverlay = false,
				snippetProps,
				onClose
			} = dialogOptions
			dialogState.dialogs.push({
				id: Math.random().toString(36).substring(7),
				dialogContentSnippet,
				options: { position, closeOnEscape, closeOnOverlay, snippetProps, onClose }
			})
		},
		options: () => dialogState.dialogs[dialogState.dialogs.length - 1]?.options,
		close: () => {
			const dialog = dialogState.dialogs.pop()
			// call any onClose function if it exists
			dialog?.options.onClose?.()
		},
		closeAll: () => {
			dialogState.dialogs = []
		}
	})
</script>

<script lang="ts">
	import { fade } from 'svelte/transition'
	import { twMerge } from 'tailwind-merge'

	let dialog = $state() as HTMLDialogElement

	$effect(() => {
		if (dialogState.size()) {
			// open the dialog if the stack is not empty
			if (dialogState.size() === 1) {
				// prevent scrolling of the body when the dialog is open
				document.body.style.overflow = 'hidden'

				// need to trigger only once for the first component in the stack
				dialog.showModal()
			}
		} else {
			// close the dialog if the stack is empty
			dialog.close()
			// reset the body styles
			document.body.style.overflow = ''
		}
	})

	$effect(() => {
		if (!dialog) return
		const handleCloseOnCancel = (event: Event) => {
			if (!dialogState.options()?.closeOnEscape) {
				event.preventDefault() // prevent the dialog from closing if closeOnEscape is false
			} else {
				if (dialogState.size() > 1) {
					event.preventDefault() // prevent the dialog from closing if there are more in the stack
					dialogState.close() // close the top component in the stack
				} else {
					dialogState.closeAll() // clear the stack if there are no more components
				}
			}
		}
		dialog.addEventListener('cancel', handleCloseOnCancel)

		const handleOverlayClick = (event: Event) => {
			if (
				dialogState.options()?.closeOnOverlay &&
				(event.target === event.currentTarget ||
					(event.target instanceof HTMLElement && event.target?.id === 'overlay'))
			) {
				dialogState.close() // close the top component in the stack
			}
		}
		dialog.addEventListener('click', handleOverlayClick)

		return () => {
			if (!dialog) return
			dialog.removeEventListener('cancel', handleOverlayClick)
			dialog.removeEventListener('click', handleCloseOnCancel)
		}
	})
</script>

<dialog
	bind:this={dialog}
	class="h-dvh w-full max-w-[100vw] overflow-hidden bg-transparent backdrop:bg-black/70 backdrop:backdrop-blur-sm focus-within:outline-none"
>
	{#each dialogState.dialogs as { id, dialogContentSnippet, options }, i (id)}
		<div
			in:fade={{ duration: 200 }}
			id={i === dialogState.dialogs.length - 1 ? 'overlay' : undefined}
			class={twMerge(
				'flex h-full flex-col items-center justify-center overflow-hidden',
				i !== dialogState.dialogs.length - 1 && 'hidden',
				options.position === 'bottom' && 'justify-end',
				options.position === 'center' && 'justify-center',
				options.position === 'top' && 'justify-start'
			)}
		>
			{@render dialogContentSnippet(options.snippetProps)}
		</div>
	{/each}
</dialog>

<style>
	dialog {
		margin: revert;
	}
</style>
