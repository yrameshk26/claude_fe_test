import { tick } from 'svelte'

export default function getPickerPosition(baseRef: HTMLElement, pickerRef: HTMLElement) {
	tick()

	// Defaults
	let pickerLeftPosition = 0
	let pickerTopPosition = 0

	// The child of the baseRef is what is visually seen, all calculations should use this to make sure they line up properly
	if (pickerRef) {
		const inputRect = baseRef.getBoundingClientRect()

		// pickerRef is positioned fixed, so we need to adjust the left position of it based on the position of the inputRect. The pickerRef should always be center.
		const windowScrollLeft = window.scrollX
		const inputLeft = inputRect.left + windowScrollLeft
		const pickerWidth = pickerRef.offsetWidth
		// const inputWidth = inputRect.width
		const pickerLeft = inputLeft
		pickerLeftPosition = pickerLeft - windowScrollLeft
		// make sure the picker is not outside the window
		if (pickerLeftPosition < 0) {
			pickerLeftPosition = 5
		} else if (pickerLeftPosition + pickerWidth > window.innerWidth) {
			pickerLeftPosition = window.innerWidth - pickerWidth
		}

		// pickerRef is positioned fixed, so we need to adjust the top position of it based on the position of the inputRect. The pickerRef should always be closer to the inputRect.
		const windowScrollTop = window.scrollY - 80
		const inputTop = inputRect.top + windowScrollTop
		const inputBottom = inputRect.bottom + windowScrollTop
		const pickerHeight = pickerRef.offsetHeight
		const showAbove = inputBottom + pickerHeight + 5 > window.innerHeight
		const pickerTop = showAbove ? inputTop - pickerHeight : inputBottom
		pickerTopPosition = pickerTop - windowScrollTop + (showAbove ? -5 : 0)
	}

	return {
		pickerLeftPosition,
		pickerTopPosition
	}
}
