<script lang="ts" module>
	import type { Component } from 'svelte'

	type ToastOptions = {
		position?:
			| 'top-left'
			| 'top-center'
			| 'top-right'
			| 'bottom-left'
			| 'bottom-center'
			| 'bottom-right'
		snippetProps?: any
		timeout?: number // in milliseconds
		onClose?: () => void
	}

	type Toast = {
		id: string
		toastContentComponent: Component<ToastOptions['snippetProps'], Record<string, unknown>, string>
		options: ToastOptions
		timer: {
			timeout?: any
			startTime: number
		}
	}

	export const toastState = $state({
		toasts: [] as Toast[],
		size: () => toastState.toasts.length,
		add: (
			toastContentComponent: Component<
				ToastOptions['snippetProps'],
				Record<string, unknown>,
				string
			>,
			toastOptions: ToastOptions = {}
		) => {
			const { position = 'top-right', timeout = 5000, snippetProps, onClose } = toastOptions
			const id = Math.random().toString(36).substring(7)
			toastState.toasts.unshift({
				id,
				toastContentComponent,
				options: { position, timeout, snippetProps, onClose },
				timer: {
					timeout:
						timeout !== 0
							? setTimeout(() => {
									// close the toast after timeout milliseconds
									toastState.close(id)
									// call any onClose function if it exists
									onClose?.()
								}, timeout)
							: undefined,
					startTime: Date.now()
				}
			})
		},
		options: () => toastState.toasts[0]?.options,
		close: (id: string) => {
			const toast = toastState.toasts.find((toast) => toast.id === id)
			if (!toast) return
			clearTimeout(toast.timer.timeout)
			toastState.toasts = toastState.toasts.filter((toast) => toast.id !== id)
		},
		closeAll: () => {
			toastState.toasts = []
		}
	})
</script>

<script lang="ts">
	import { fade } from 'svelte/transition'
	import { twMerge } from 'tailwind-merge'

	// get the top or bottom offset of the toast based on previous toasts in the same position
	const getOffset = (toast: Toast) => {
		const toasts = toastState.toasts.filter((t) => t.options.position === toast.options.position)
		const index = toasts.findIndex((t) => t.id === toast.id)
		return 6 + index * 30
	}
</script>

{#each toastState.toasts as toast, i (toast.id)}
	<div
		role="alert"
		onmouseenter={() => {
			// pause the timer
			clearTimeout(toast.timer.timeout)
		}}
		onmouseleave={() => {
			if (!toastState.toasts[i]) return
			// set a new timeout to close the toast
			if (toastState.toasts[i].timer.timeout) {
				toastState.toasts[i].timer.timeout = setTimeout(() => {
					toastState.close(toast.id)
					// call any onClose function if it exists
					toast.options.onClose?.()
				}, toast.options.timeout || 5000)
			}
		}}
		transition:fade={{ duration: 100 }}
		class={twMerge(
			'pointer-events-none fixed z-500 w-fit overflow-hidden',
			toast.options.position === 'top-left' && 'top-5 left-5',
			toast.options.position === 'top-center' && 'top-5 left-1/2 -translate-x-1/2',
			toast.options.position === 'top-right' && 'top-5 right-5',
			toast.options.position === 'bottom-left' && 'bottom-5 left-5',
			toast.options.position === 'bottom-center' && 'bottom-5 left-1/2 -translate-x-1/2',
			toast.options.position === 'bottom-right' && 'right-5 bottom-5'
		)}
		style:z-index={500 + i}
		style:top={toast.options.position?.includes('top') ? getOffset(toast) + 'px' : undefined}
		style:bottom={toast.options.position?.includes('bottom') ? getOffset(toast) + 'px' : undefined}
	>
		<div class="pointer-events-auto shadow-lg">
			<toast.toastContentComponent {...toast.options.snippetProps} {toast} />
		</div>
	</div>
{/each}
