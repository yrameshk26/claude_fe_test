<script lang="ts" module>
	export type Props = {
		name: string
	}

	export const printerState = $state({
		isPrinting: false
	})
</script>

<script lang="ts">
	import { TextInput } from '../inputs'
	import { GhostButton, SolidButton } from '../buttons'
	import { PrinterIcon, ArrowDownTrayIcon } from '../../icons'
	import { toastState } from '../display/Toast.svelte'
	import { dialogState } from '../display/Dialog.svelte'
	import { SuccessToast, ErrorToast } from '../toasts'

	import html2canvas from 'html2canvas-pro'
	import { jsPDF } from 'jspdf'
	import * as Sentry from '@sentry/sveltekit'
	import { twMerge } from 'tailwind-merge'
	import { tick } from 'svelte'

	let { name }: Props = $props()

	const PAGE_SIZES = {
		A4: {
			landscape: { width: 297, height: 210, iconSnippet: iconA4SnippetLandscape },
			portrait: { width: 210, height: 297, iconSnippet: iconA4SnippetPortrait }
		},
		A3: {
			portrait: { width: 297, height: 420, iconSnippet: iconA3SnippetPortrait },
			landscape: { width: 420, height: 297, iconSnippet: iconA3SnippetLandscape }
		},
		A2: {
			portrait: { width: 420, height: 594, iconSnippet: iconA2SnippetPortrait },
			landscape: { width: 594, height: 420, iconSnippet: iconA2SnippetLandscape }
		}
	}

	let containerHeight = $state(0)
	let documentTitle = $state('')
	let pageSize = $state('A4') as keyof typeof PAGE_SIZES
	let pageOrientation = $state('portrait') as keyof (typeof PAGE_SIZES)[typeof pageSize]
	let action = $state('print') as 'print' | 'download'

	$effect(() => {
		setDocumentTitle()
		// save container height
		const container = document.getElementById('container')
		containerHeight = container?.getBoundingClientRect().height || 0
	})

	const setDocumentTitle = () => {
		// grab pagination element's text content
		const pagination = document.getElementById('pagination')
		if (pagination) {
			documentTitle = name + ' ' + `${pagination.textContent}`
		} else {
			documentTitle = name
		}
	}

	function onClose() {
		reset()
		dialogState.close()
	}

	function addImageAcrossPages(doc: jsPDF, dataUrl: string, margin = 10) {
		// Get the page width and height from global variables `pageSize` and `pageOrientation`
		const pageWidth = PAGE_SIZES[pageSize][pageOrientation].width
		const pageHeight = PAGE_SIZES[pageSize][pageOrientation].height

		// Create a canvas to draw and crop the image
		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext('2d')

		if (!ctx) {
			toastState.add(ErrorToast, {
				snippetProps: { message: 'Failed to create canvas context. Please try again.' },
				position: 'top-center'
			})
			return
		}

		// Get the image properties
		const img = new Image()
		img.src = dataUrl

		img.onload = function () {
			const imgWidth = img.width
			const imgHeight = img.height

			// Calculate the available width after margins (fit image to the width of the page)
			const availableWidth = pageWidth - 2 * margin

			// Calculate the aspect ratio of the image
			const imgAspectRatio = imgWidth / imgHeight

			// Scale the image to the available width while maintaining aspect ratio
			const scaledWidth = availableWidth
			const scaledHeight = scaledWidth / imgAspectRatio

			// Calculate how much height is available for the image on each page (excluding title space)
			const titleHeight = 20 // Space for the title and page number
			const availableHeight = pageHeight - (2 * margin + titleHeight)

			// Calculate how many pages are needed based on scaled image height and available page height
			const numPages = Math.ceil(scaledHeight / availableHeight)

			let remainingHeight = scaledHeight
			let currentOffsetY = 0 // Track how much of the image has been rendered so far

			// Loop through the required number of pages
			for (let i = 0; i < numPages; i++) {
				if (i > 0) {
					doc.addPage() // Add a new page if not the first page
				}

				// Add the page title and the current page number at the top
				doc.setFontSize(14)
				doc.text(documentTitle, margin, margin + 5) // Title position
				doc.text(`Page ${i + 1} of ${numPages}`, pageWidth - margin - 40, margin + 5) // Page number

				// Calculate the portion of the image that fits on the current page
				const partHeight = Math.min(availableHeight, remainingHeight)

				// Set canvas size based on the image's portion to be rendered
				canvas.width = imgWidth
				canvas.height = (partHeight / scaledHeight) * imgHeight

				// Draw the current part of the image onto the canvas
				ctx.drawImage(
					img,
					0,
					(currentOffsetY / scaledHeight) * imgHeight, // sx, sy: Crop starting point in the original image
					imgWidth,
					(partHeight / scaledHeight) * imgHeight, // sWidth, sHeight: Size of the cropped portion
					0,
					0, // dx, dy: Position on the canvas
					imgWidth,
					(partHeight / scaledHeight) * imgHeight // dWidth, dHeight: Size of the drawn portion
				)

				// Convert the canvas back to a data URL
				const croppedDataUrl = canvas.toDataURL('image/jpeg', 1.0)

				// Add the cropped image to the PDF
				doc.addImage(
					croppedDataUrl,
					'JPEG',
					margin, // xOffset: Add margin for left-right
					margin + titleHeight, // yOffset: Start after title space
					scaledWidth,
					partHeight // Display the correct portion of the image
				)

				// Update remaining height and current offset for the next page
				currentOffsetY += partHeight
				remainingHeight -= partHeight
			}
			toastState.add(SuccessToast, {
				snippetProps: { message: 'Successfully generated PDF.' },
				position: 'top-center'
			})
			if (action === 'download') {
				// Save the PDF once all pages are rendered
				doc.save('tvupweb' + '_' + String(documentTitle).replace(/ /g, '_') + '.pdf')
			} else if (action === 'print') {
				// Get the PDF data as a Blob and open it in a new window
				const pdfBlob = doc.output('blob')
				const url = URL.createObjectURL(pdfBlob)
				// Open the PDF in a new window and invoke the browser's print dialog
				const printWindow = window.open(url, '_blank')
				if (!printWindow) return
				printWindow.onload = function () {
					printWindow.focus() // Ensure the window is focused
					printWindow.print() // Invoke the browser's print dialog
				}
			}
			reset()
		}
	}

	const reset = () => {
		// set html, body overflow to 'hidden'
		document.documentElement.style.overflow = 'hidden'
		document.body.style.overflow = 'hidden'
		// set table layout back to 'auto'
		const table = document.getElementsByTagName('table')[0]
		if (table) table.style.tableLayout = 'auto'
		// reset container height
		if (containerHeight) {
			document.getElementById('container')!.style.height = containerHeight + 'px'
		}
		dialogState.close()
		printerState.isPrinting = false
	}

	const printTable = async () => {
		printerState.isPrinting = true
		await tick()
		try {
			// unset html, body overflow
			document.documentElement.style.overflow = 'unset'
			document.body.style.overflow = 'unset'
			// remove explicit height from container
			const container = document.getElementById('container')
			if (!container) return
			containerHeight = container.getBoundingClientRect().height
			document.getElementById('container')!.style.height = 'unset'
			// capture the <table> element as screenshot and download it
			const table = document.getElementsByTagName('table')[0]
			if (!table) return
			// set table layout to 'auto' so that it takes up all available space
			table.style.tableLayout = 'auto'
			html2canvas(table)
				.then((canvas) => {
					// set table layout back to 'fixed'
					table.style.tableLayout = 'fixed'
					// download as PDF
					const doc = new jsPDF({
						orientation: pageOrientation,
						unit: 'mm',
						format: [
							PAGE_SIZES[pageSize][pageOrientation].width,
							PAGE_SIZES[pageSize][pageOrientation].height
						]
					})
					// Compress the canvas to JPEG format to reduce file size
					addImageAcrossPages(doc, canvas.toDataURL('image/jpeg'))
				})
				.catch((error) => {
					toastState.add(ErrorToast, {
						snippetProps: { message: 'Failed to print table', extraMessage: error.message },
						position: 'top-center'
					})
					console.error(error)
					Sentry.captureException(error)
					reset()
				})
		} catch (error) {
			toastState.add(ErrorToast, {
				snippetProps: { message: 'Failed to print table', extraMessage: error },
				position: 'top-center'
			})
			console.error(error)
			Sentry.captureException(error)
			reset()
		}
	}
</script>

{#snippet iconA4SnippetLandscape()}
	<svg width="59.4" height="42" viewBox="0 0 297 210" xmlns="http://www.w3.org/2000/svg">
		<rect width="297" height="210" style="fill:lightgray;" />
		<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="60"> A4 </text>
	</svg>
{/snippet}

{#snippet iconA4SnippetPortrait()}
	<svg width="42" height="59.4" viewBox="0 0 210 297" xmlns="http://www.w3.org/2000/svg">
		<rect width="210" height="297" style="fill:lightgray;" />
		<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="60"> A4 </text>
	</svg>
{/snippet}

{#snippet iconA3SnippetLandscape()}
	<svg width="84" height="59.4" viewBox="0 0 420 297" xmlns="http://www.w3.org/2000/svg">
		<rect width="420" height="297" style="fill:lightgray;" />
		<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="60">A3</text>
	</svg>
{/snippet}

{#snippet iconA3SnippetPortrait()}
	<svg width="59.4" height="84" viewBox="0 0 297 420" xmlns="http://www.w3.org/2000/svg">
		<rect width="297" height="420" style="fill:lightgray;" />
		<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="60">A3</text>
	</svg>
{/snippet}

{#snippet iconA2SnippetLandscape()}
	<svg width="118.8" height="84" viewBox="0 0 594 420" xmlns="http://www.w3.org/2000/svg">
		<rect width="594" height="420" style="fill:lightgray;" />
		<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="60">A2</text>
	</svg>
{/snippet}

{#snippet iconA2SnippetPortrait()}
	<svg width="84" height="118.8" viewBox="0 0 420 594" xmlns="http://www.w3.org/2000/svg">
		<rect width="420" height="594" style="fill:lightgray;" />
		<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="60">A2</text>
	</svg>
{/snippet}

{#snippet dialogSnippet()}
	<div class="flex w-full max-w-sm flex-col gap-4 overflow-auto rounded-md bg-white p-6">
		<p class="text-lg font-semibold">Download or Print as PDF</p>
		<TextInput isRequired label="Document Title" bind:value={documentTitle} />
		<p class="mt-2 text-xs">Page Size & Orientation</p>
		<div class="-mt-2 grid w-fit grid-cols-2 items-baseline justify-items-center gap-4 self-center">
			{#each Object.entries(PAGE_SIZES) as [name, { landscape, portrait }] (name)}
				{#each [portrait, landscape] as { iconSnippet }, i (iconSnippet)}
					<GhostButton
						onclick={() => {
							pageSize = name as keyof typeof PAGE_SIZES
							pageOrientation = i === 1 ? 'landscape' : 'portrait'
						}}
						class={twMerge(
							'h-fit w-fit p-1 hover:bg-blue-300',
							pageSize === name &&
								pageOrientation === 'landscape' &&
								i === 1 &&
								'bg-blue-500 hover:bg-blue-600',
							pageSize === name &&
								pageOrientation === 'portrait' &&
								i === 0 &&
								'bg-blue-500 hover:bg-blue-600'
						)}
					>
						{@render iconSnippet()}
					</GhostButton>
				{/each}
			{/each}
		</div>
		<div class="flex w-full flex-1 items-center justify-between gap-4 self-end pt-4">
			<GhostButton onclick={onClose} isDisabled={printerState.isPrinting}>Cancel</GhostButton>
			<div class="flex gap-4">
				<SolidButton
					hideDisabledIcon
					isDisabled={!documentTitle || (printerState.isPrinting && action === 'print')}
					isLoading={printerState.isPrinting && action === 'download'}
					onclick={() => {
						action = 'download'
						printTable()
					}}
				>
					{#if !(printerState.isPrinting && action === 'download')}
						<ArrowDownTrayIcon class="mr-1" />
					{/if}
					Download
				</SolidButton>
				<SolidButton
					hideDisabledIcon
					isDisabled={!documentTitle || (printerState.isPrinting && action === 'download')}
					isLoading={printerState.isPrinting && action === 'print'}
					onclick={() => {
						action = 'print'
						printTable()
					}}
				>
					{#if !(printerState.isPrinting && action === 'print')}
						<PrinterIcon class="mr-1" />
					{/if}
					Print
				</SolidButton>
			</div>
		</div>
	</div>
{/snippet}

<GhostButton
	class={twMerge('p-1', printerState.isPrinting && 'hidden')}
	onclick={() => {
		dialogState.add(dialogSnippet)
		setDocumentTitle()
	}}
>
	<span class="sr-only">Download or Print as PDF</span>
	<PrinterIcon />
</GhostButton>
