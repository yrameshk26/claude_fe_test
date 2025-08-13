<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'New Product'

	import { Tabs } from '$sveltewind/components/display'

	import { enhance } from '$app/forms'
	import { page } from '$app/state'
	import { goto } from '$app/navigation'

	import { SolidButton } from '$sveltewind/components/buttons'
	import { DateInput, TextInput, TextareaInput, SelectInput } from '$sveltewind/components/inputs'
	import { Alert } from '$sveltewind/components/display'

	import type { SubmitFunction } from '@sveltejs/kit'
	let formState = $state({
		isLoading: false,
		serverErrors: [] as string[]
	})
	const onSubmit: SubmitFunction = async ({ formData }) => {
		formState.isLoading = true
		formState.serverErrors = []
		// remove undefined values from formData
		for (const [key, value] of [...formData.entries()]) {
			if (value === undefined || value === '' || value === null) {
				formData.delete(key)
			}
		}
		return async ({ result, update }) => {
			await update()
			formState.isLoading = false
			if (result.type === 'failure') {
				formState.serverErrors = result.data?.errors
			} else if (result.type === 'success') {
				const newProductID = result.data
				goto(`/wholesale/products/${newProductID}`)
			} else if (result.type === 'redirect') {
				goto(result.location)
			}
		}
	}
</script>

<Tabs />

<form
	method="POST"
	use:enhance={onSubmit}
	class="grid h-[calc(100%-56px)] gap-4 overflow-auto p-2 lg:grid-cols-7 lg:gap-8"
>
	<div class="p-2 lg:col-span-5">
		<div class="grid gap-4 lg:grid-cols-3 lg:gap-8">
			<div class="flex flex-col gap-4 lg:gap-8">
				<div class="flex flex-col gap-4">
					<h2 class="font-semibold">Basic Info</h2>
					<TextInput autofocus isRequired name="serialNo" label="Serial Number" />
					<TextInput name="macID" label="MAC ID" />
					<SelectInput
						isRequired
						name="productTypeID"
						label="Product Type"
						loadMoreUrl="/_api/autocomplete/productTypes"
					/>
				</div>
			</div>

			<div class="flex flex-col gap-4 lg:col-span-2 lg:gap-8">
				<div class="flex flex-col gap-4">
					<h2 class="font-semibold">Vendor</h2>
					<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
						<SelectInput
							isRequired
							name="vendorID"
							label="Name"
							loadMoreUrl="/_api/autocomplete/vendors"
							value={page.url.searchParams.get('vendorID') || ''}
						/>
						<TextInput isRequired name="vendorInvoiceNo" label="Invoice Number" />
						<DateInput
							isRequired
							name="vendorPurchaseDt"
							label="Purchase Date"
							value={new Date()}
						/>
						<DateInput
							isRequired
							name="vendorWarrantyExpiryDt"
							label="Warranty Expiry Date"
							value={new Date(new Date().setDate(new Date().getDate() + 365))}
						/>
					</div>
				</div>

				<div class="flex flex-col gap-4">
					<h2 class="font-semibold">Reseller</h2>
					<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
						<SelectInput
							name="resellerID"
							label="Name"
							loadMoreUrl="/_api/autocomplete/resellers"
							value={page.url.searchParams.get('resellerID') || ''}
						/>
						<TextInput name="resellerInvoiceNo" label="Invoice Number" />
						<DateInput name="resellerPurchaseDt" label="Purchase Date" />
						<DateInput name="resellerWarrantyExpiryDt" label="Warranty Expiry Date" />
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="flex flex-col gap-4 p-2 lg:col-span-2">
		<h2 class="font-semibold">Other Info</h2>
		<div class="flex flex-col gap-4 pb-8">
			<TextareaInput name="notes" label="Add a note" />
		</div>
		{#each formState.serverErrors as error (error)}
			<Alert type="error">{error}</Alert>
		{/each}

		<SolidButton type="submit" isLoading={formState.isLoading}>Submit</SolidButton>
	</div>
</form>
