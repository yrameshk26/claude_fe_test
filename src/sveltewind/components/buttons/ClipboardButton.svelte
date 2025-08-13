<script lang="ts" module>
	export type Props = {
		containerID: string
		class?: string
		classIcon?: string
	}
</script>

<script lang="ts">
	import GhostButton from './GhostButton.svelte'
	import { ClipboardIcon, ClipboardCheckIcon } from '../../icons'
	import { SuccessToast } from '../toasts'
	import { toastState } from '../display/Toast.svelte'

	import { twMerge } from 'tailwind-merge'

	let { containerID, class: classButton, classIcon }: Props = $props()

	let isCopied = $state(false)
	const copyToClipboard = async (e: MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		const el = document.getElementById(containerID)
		if (!el) return
		const text = el.textContent?.trim()
		if (!text) return
		try {
			await navigator.clipboard.writeText(text)
			isCopied = true
			toastState.add(SuccessToast, {
				snippetProps: { message: 'Copied to clipboard!' },
				timeout: 2000,
				position: 'top-center'
			})
			setTimeout(() => {
				isCopied = false
			}, 2000)
		} catch (err) {
			if (err instanceof Error) {
				toastState.add(SuccessToast, {
					timeout: 2000,
					position: 'bottom-right',
					snippetProps: { message: err.message }
				})
				console.error(err.message)
			} else {
				toastState.add(SuccessToast, {
					timeout: 2000,
					position: 'bottom-right',
					snippetProps: { message: 'Failed to copy!' }
				})
			}
		}
	}
</script>

<GhostButton
	tabindex={-1}
	class={twMerge('w-fit justify-start p-1', classButton)}
	onclick={copyToClipboard}
>
	<span class="sr-only">Copy To Clipboard</span>
	{#if !isCopied}
		<ClipboardIcon class={twMerge('size-4 text-current', classIcon)} />
	{:else}
		<ClipboardCheckIcon class={twMerge('size-4 text-current', classIcon)} />
	{/if}
</GhostButton>
