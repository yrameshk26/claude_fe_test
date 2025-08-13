type ActionType = import('svelte/action').Action<HTMLElement, ((value: string) => void) | undefined>

const stopTyping: ActionType = (node, callback) => {
	function handleEvent(event: KeyboardEvent | ClipboardEvent) {
		if (node.contains(event.target as Node)) {
			const target = event.target as HTMLInputElement
			callback?.(target.value)
		}
	}

	let timeoutID: number

	const handleKeyup = (event: KeyboardEvent | ClipboardEvent) => {
		window.clearTimeout(timeoutID)
		timeoutID = window.setTimeout(() => {
			handleEvent(event)
		}, 500)
	}

	node.addEventListener('keyup', handleKeyup, true)
	node.addEventListener('paste', handleKeyup, true)

	return {
		destroy() {
			node.removeEventListener('keyup', handleKeyup, true)
			node.removeEventListener('paste', handleKeyup, true)
		}
	}
}

export default stopTyping
