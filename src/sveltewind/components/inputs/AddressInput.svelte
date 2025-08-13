<script lang="ts" module>
	import type { Props } from './TextInput.svelte'

	export type Address = {
		streetNumber?: string
		streetName?: string
		city?: string
		province?: string
		postalCode?: string
		country?: string
	}
</script>

<script lang="ts">
	import TextInput from './TextInput.svelte'

	let {
		inputRef = $bindable() as HTMLInputElement,
		value = $bindable(''),
		onAddressChange,
		...restInputProps
	}: Props & {
		onAddressChange?: (address: Address) => void
	} = $props()

	$effect(() => {
		initMap()
	})

	const initMap = async () => {
		const Places = (await google.maps.importLibrary('places')) as google.maps.PlacesLibrary
		const autocomplete = new Places.Autocomplete(inputRef, {
			types: ['geocode'],
			fields: ['address_components'],
			strictBounds: true
		})
		autocomplete.addListener('place_changed', () => {
			const place = autocomplete.getPlace()
			if (!place.address_components) return
			parseAddress(place.address_components)
		})
	}

	const parseAddress = async (addressComponents: google.maps.GeocoderAddressComponent[]) => {
		// parse google maps addressComponents to address object
		const streetNumber = addressComponents.find((component) =>
			component.types.includes('street_number')
		)?.long_name
		const streetName = addressComponents.find((component) =>
			component.types.includes('route')
		)?.long_name
		const city = addressComponents.find((component) =>
			component.types.includes('locality')
		)?.long_name
		const province = addressComponents.find((component) =>
			component.types.includes('administrative_area_level_1')
		)?.long_name
		const postalCode = addressComponents.find((component) =>
			component.types.includes('postal_code')
		)?.long_name
		const country = addressComponents.find((component) =>
			component.types.includes('country')
		)?.long_name
		onAddressChange?.({ streetNumber, streetName, city, province, postalCode, country })
	}
</script>

<svelte:head>
	<script>
		;((g) => {
			var h,
				a,
				k,
				p = 'The Google Maps JavaScript API',
				c = 'google',
				l = 'importLibrary',
				q = '__ib__',
				m = document,
				b = window
			b = b[c] || (b[c] = {})
			var d = b.maps || (b.maps = {}),
				r = new Set(),
				e = new URLSearchParams(),
				u = () =>
					h ||
					(h = new Promise(async (f, n) => {
						await (a = m.createElement('script'))
						e.set('libraries', [...r] + '')
						for (k in g)
							e.set(
								k.replace(/[A-Z]/g, (t) => '_' + t[0].toLowerCase()),
								g[k]
							)
						e.set('callback', c + '.maps.' + q)
						a.src = `https://maps.${c}apis.com/maps/api/js?` + e
						d[q] = f
						a.onerror = () => (h = n(Error(p + ' could not load.')))
						a.nonce = m.querySelector('script[nonce]')?.nonce || ''
						m.head.append(a)
					}))
			d[l]
				? console.warn(p + ' only loads once. Ignoring:', g)
				: (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)))
		})({
			key: 'AIzaSyBEfLh_GQDzKS3tvs8diVUsQC-Jw1CidtE',
			v: 'weekly'
		})
	</script>
</svelte:head>

<TextInput bind:inputRef bind:value {...restInputProps} />
