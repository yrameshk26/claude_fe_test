type ActionType = import('svelte/action').Action<HTMLElement, (() => void) | undefined>

const clickOutside: ActionType = (node, callback) => {
	const handleClick = (event: MouseEvent) => {
		if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
			callback?.()
		}
	}

	const handleFocusIn = () => {
		if (!node.contains(document.activeElement)) {
			callback?.()
		}
	}

	document.addEventListener('click', handleClick, true)
	document.addEventListener('focusin', handleFocusIn)

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true)
			document.removeEventListener('focusin', handleFocusIn)
		}
	}
}

export default clickOutside
