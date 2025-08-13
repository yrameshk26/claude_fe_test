type ActionType = import('svelte/action').Action<HTMLElement, string>

const tooltipAction: ActionType = (node, tooltipText) => {
	node.style.position = 'relative'
	node.style.whiteSpace = 'nowrap'
	node.style.paddingTop = '0.35rem'
	node.style.cursor = 'default'
	node.style.width = 'max-content'

	function handleFocus() {
		const child = document.createElement('span')
		child.textContent = tooltipText
		child.style.position = 'absolute'
		child.style.bottom = '100%'
		child.style.left = '50%'
		child.style.transform = 'translate(-50%, 0)'
		child.style.padding = '0.2rem 0.35rem'
		child.style.background = 'hsl(0, 0%, 20%)'
		child.style.color = 'hsl(0, 0%, 98%)'
		child.style.fontSize = '0.8rem'
		child.style.borderRadius = '0.25rem'
		child.style.filter = 'drop-shadow(0 1px 2px hsla(0, 0%, 0%, 0.2)'
		child.style.width = 'max-content'
		child.setAttribute('id', 'tooltip')

		// add arrow to tooltip
		const arrow = document.createElement('span')
		arrow.style.position = 'absolute'
		arrow.style.top = '100%'
		arrow.style.left = '50%'
		arrow.style.transform = 'translate(-50%, 0)'
		arrow.style.width = '0.6em'
		arrow.style.height = '0.25em'
		arrow.style.background = 'inherit'
		arrow.style.clipPath = 'polygon(0% 0%, 100% 0%, 50% 100%)'
		child.appendChild(arrow)

		node.appendChild(child)

		node.addEventListener('mouseleave', handleBlur)
		node.addEventListener('blur', handleBlur)
		node.removeEventListener('mouseenter', handleFocus)
		node.removeEventListener('focus', handleFocus)
	}

	function handleBlur() {
		node.removeChild(node.querySelector('#tooltip') as Node)

		node.removeEventListener('mouseleave', handleBlur)
		node.removeEventListener('blur', handleBlur)
		node.addEventListener('mouseenter', handleFocus)
		node.addEventListener('focus', handleFocus)
	}

	node.addEventListener('mouseenter', handleFocus)
	node.addEventListener('focus', handleFocus)

	// listen for focus on any immediate child of the node and show tooltip
	const children = node.children
	for (let i = 0; i < children.length; i++) {
		children[i].addEventListener('focus', handleFocus)
		children[i].addEventListener('blur', handleBlur)
	}

	return {
		destroy() {
			node.classList.remove('tooltip')
			node.removeEventListener('mouseenter', handleFocus)
			node.removeEventListener('focus', handleFocus)
		}
	}
}

export default tooltipAction
