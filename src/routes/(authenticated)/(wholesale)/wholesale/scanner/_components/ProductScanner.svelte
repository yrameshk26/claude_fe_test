<script lang="ts" module>
	type Props = {
		onDetect: (values: { macID?: string; serialNo: string }[]) => void
	}
</script>

<script lang="ts">
	import { stopTyping } from '$sveltewind/actions'

	let barcodeSound = $state() as HTMLAudioElement

	let { onDetect }: Props = $props()

	let inputRef: HTMLInputElement | undefined = $state()
	let barcodeInput = $state('') // the barcode input value
	let barcode = $state('') // the parsed barcode value

	// sample: SerialNo and MacID pairs
	//PC-22000241!2!072022P002488!001A797C1BC4!072022P002490!001A797C1BC6!072022P002471!001A797C1BB3!072022P002476!001A797C1BB8!072022P002493!001A797C1BC9!072022P002482!001A797C1BBE!072022P002473!001A797C1BB5!072022P002483!001A797C1BBF!072022P002470!001A797C1BB2!072022P002468!001A797C1BB0
	const BARCODE_VALID_REGEX_1 = new RegExp(/(?<=!)[0-9A-Za-z]+![0-9A-F]{12}/g)

	// sample: SerialNo only
	// SAROGT5B033796d6SAROGT5B0337954eSAROGT5B0337997cSAROGT5B033796d2SAROGT5B033796c9SAROGT5B03379742SAROGT5B03379c8cSAROGT5B03379388SAROGT5B03379ca7SAROGT5B03379b87SAROGT5B0337949eSAROGT5B03379890SAROGT5B0337956fSAROGT5B03379420SAROGT5B03379ca6SAROGT5B033799c6SAROGT5B033798bfSAROGT5B033795e2SAROGT5B03379b45SAROGT5B03379be0
	const BARCODE_VALID_REGEX_2 = new RegExp(/[0-9A-Za-z]{16}/g)

	// single serial number with macID and other info
	// 052023N026050!001A797E54C7|MAG540w3 18C-P0L-00 02
	const BARCODE_VALID_REGEX_3 = new RegExp(/[0-9A-Za-z]{13,14}![0-9A-F]{12}/g)

	// single serial number
	// 8809604570573
	const BARCODE_VALID_REGEX_4 = new RegExp(/[0-9A-Za-z]{13,14}/g)

	const handleStopTyping = (value: string) => {
		// if the barcode is in the correct format, submit it
		barcode = value.trim()
		if (
			BARCODE_VALID_REGEX_1.test(barcode) ||
			BARCODE_VALID_REGEX_2.test(barcode) ||
			BARCODE_VALID_REGEX_3.test(barcode) ||
			BARCODE_VALID_REGEX_4.test(barcode)
		) {
			// set the lookup barcode to trigger the user lookup component
			extractMacIDSerialNo(barcode)
		}
	}

	const extractMacIDSerialNo = (barcode: string) => {
		barcodeSound.play()
		const products = [] as { macID?: string; serialNo: string }[]
		if (BARCODE_VALID_REGEX_1.test(barcode)) {
			// split the barcode into pairs of macID and serial number
			const pairs = barcode.match(BARCODE_VALID_REGEX_1) || []
			// create an array of objects with macID and serial number
			for (let i = 0; i < pairs.length; i++) {
				let [serialNo, macID] = pairs[i].split('!')
				// format the macID with a colon and uppercase
				macID =
					macID
						.match(/.{1,2}/g)
						?.join(':')
						?.toUpperCase() || ''
				products.push({ macID, serialNo })
			}
		} else if (BARCODE_VALID_REGEX_2.test(barcode)) {
			// split the barcode into pairs of serial number
			const pairs = barcode.match(BARCODE_VALID_REGEX_2) || []
			// create an array of objects with macID and serial number
			for (let i = 0; i < pairs.length; i++) {
				products.push({ serialNo: pairs[i] })
			}
		} else if (BARCODE_VALID_REGEX_3.test(barcode)) {
			// extract the serial number and macID from barcode
			const pair = barcode.match(BARCODE_VALID_REGEX_3) || ([] as string[])
			const [serialNo, macID] = pair[0].split('!')
			// format the macID with a colon and uppercase
			const formattedMacID =
				macID
					.match(/.{1,2}/g)
					?.join(':')
					?.toUpperCase() || ''
			products.push({ macID: formattedMacID, serialNo })
		} else if (BARCODE_VALID_REGEX_4.test(barcode)) {
			// split the barcode into pairs of serial number
			const pairs = barcode.match(BARCODE_VALID_REGEX_4) || []
			// create an array of objects with macID and serial number
			for (let i = 0; i < pairs.length; i++) {
				products.push({ serialNo: pairs[i] })
			}
		}
		onDetect(products)
		// reset the barcode input
		barcodeInput = ''
	}

	$effect(() => {
		// focus the input on mount
		inputRef?.focus()
		barcodeSound = new Audio('/barcode.mp3')
	})
</script>

<div class="mx-auto flex flex-col gap-2">
	<span class="sr-only">Scanner Input</span>
	<input
		bind:this={inputRef}
		use:stopTyping={handleStopTyping}
		bind:value={barcodeInput}
		type="search"
		class="focus-within:ring-textInput rounded-md bg-white p-3 text-center text-sm font-medium ring-1 ring-gray-300 transition-all focus-within:border-transparent focus-within:ring-2 focus-within:outline-2 focus-within:outline-transparent"
		placeholder="scan or input barcode"
	/>
</div>
