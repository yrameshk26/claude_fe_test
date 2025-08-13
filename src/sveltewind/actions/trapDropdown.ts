type ActionType = import('svelte/action').Action<HTMLElement, string | undefined>

const trapUpDownFocus: ActionType = (node, selector = '') => {
	const handleKeydown = (event: KeyboardEvent) => {
		// we're only interested in handling up & down arrow keys
		if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return

		// prevent the default behavior (scrolling the page)
		event.preventDefault()

		const focusableItems = [
			...node.querySelectorAll(
				`a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[contenteditable], details, [tabindex]:not([tabindex="-1"]) ${selector}`
			)
		]

		// if there are no focusable elements, we can't do anything
		if (!focusableItems.length) return

		// find the currently focused element
		const focusedItem = document.activeElement

		// if there's no currently focused element, focus the first one
		if (!focusedItem) {
			const firstItem = focusableItems[0]
			if (firstItem instanceof HTMLElement) {
				firstItem.focus()
			}
			return
		}

		// find the index of the currently focused element
		const focusedIndex = focusableItems.indexOf(focusedItem)

		if (event.key === 'ArrowUp') {
			// if the focused element is the first one, focus the last one
			if (focusedIndex <= 0) {
				const lastItem = focusableItems[focusableItems.length - 1]
				if (lastItem instanceof HTMLElement) {
					lastItem.focus()
				}
				return
			}

			// otherwise, focus the previous one
			const previousItem = focusableItems[focusedIndex - 1]
			if (previousItem instanceof HTMLElement) {
				previousItem.focus()
			}

			return
		} else if (event.key === 'ArrowDown') {
			// if the focused element is the last one, focus the first one
			if (focusedIndex === focusableItems.length - 1) {
				if (focusableItems[0] instanceof HTMLElement) {
					focusableItems[0].focus()
				}
				return
			}

			// otherwise, focus the next one
			const nextItem = focusableItems[focusedIndex + 1]
			if (nextItem instanceof HTMLElement) {
				nextItem.focus()
			}
			return
		}
	}

	document.addEventListener('keydown', handleKeydown, true)

	return {
		destroy() {
			document.removeEventListener('keydown', handleKeydown, true)
		}
	}
}

export default trapUpDownFocus
