<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit'

	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'Sell Existing Products'

	import { enhance } from '$app/forms'
	import { goto } from '$app/navigation'

	import { Alert, TextBlock } from '$sveltewind/components/display'
	import { SolidButton, GhostButton } from '$sveltewind/components/buttons'
	import { MinusIcon } from '$sveltewind/icons'
	import { DateInput, TextInput, SelectInput, TextareaInput } from '$sveltewind/components/inputs'
	import {
		Table,
		TableHeadRow,
		TableHead,
		TableCellRow,
		TableCell
	} from '$sveltewind/components/table'

	import ProductScanner from '../_components/ProductScanner.svelte'
	import { twMerge } from 'tailwind-merge'

	let scannedProducts = $state([]) as { macID?: string; serialNo: string }[]

	let formState = $state({
		isLoading: false,
		serverErrors: [] as string[]
	})

	let nonExistingErrorProducts = $state([]) as { macID?: string; serialNo: string }[]

	const onSubmit: SubmitFunction = async ({ formData }) => {
		formState.isLoading = true
		formState.serverErrors = []
		formData.set('productIdentifiers', JSON.stringify(scannedProducts))
		return async ({ result, update }) => {
			await update()
			formState.isLoading = false
			if (result.type === 'failure') {
				formState.serverErrors = result.data?.errors
				nonExistingErrorProducts =
					result.data?.detailedErrors[0]?.extensions?.nonExistingProducts || []
			} else if (result.type === 'success') {
				localStorage.removeItem('scannedNewProducts')
				goto(`/wholesale/products`)
			} else if (result.type === 'redirect') {
				goto(result.location)
			}
		}
	}

	$effect(() => {
		// load scanned products from local storage
		const scannedProductsString = localStorage.getItem('scannedNewProducts')
		if (scannedProductsString) {
			scannedProducts = JSON.parse(scannedProductsString)
		}
	})
</script>

<ProductScanner
	onDetect={(products) => {
		formState.serverErrors = []
		scannedProducts = [...scannedProducts, ...products]
		// store in local storage temporarily until form submission
		localStorage.setItem('scannedNewProducts', JSON.stringify(scannedProducts))
	}}
/>

<form
	method="POST"
	use:enhance={onSubmit}
	class="h-[calc(100%-56px)] overflow-auto p-2 lg:overflow-hidden"
>
	<Alert type="info" class="w-full">
		<div class="flex w-full items-center justify-between">
			Start scanning products to add them to the list. Once you are done, click the submit button.
			<SolidButton type="submit" isLoading={formState.isLoading}>Submit</SolidButton>
		</div>
	</Alert>

	<div class="mt-2 -mb-2">
		{#each formState.serverErrors as error (error)}
			<Alert type="error">{error}</Alert>
		{/each}
	</div>

	<div class="grid grid-cols-1 gap-8 p-4 lg:h-[calc(100%-36px)] lg:grid-cols-5">
		<Table classContainer="lg:col-span-3 max-h-96 lg:max-h-[calc(100%)] lg:w-fit">
			{#snippet tableHead()}
				<TableHeadRow>
					<TableHead class="min-w-0">
						<span
							class="inline-flex items-center rounded-lg bg-yellow-100 px-3 py-1 text-6xl font-bold text-yellow-800"
						>
							{scannedProducts.length}
						</span>
					</TableHead>
					<TableHead class="min-w-28">Serial No</TableHead>
					<TableHead class="min-w-28">MAC ID</TableHead>
					<TableHead class="min-w-0 text-nowrap">
						<GhostButton
							--color-ghostButton="var(--color-red-600)"
							onclick={() => {
								scannedProducts = []
								localStorage.removeItem('scannedNewProducts')
							}}
						>
							Clear All
						</GhostButton>
					</TableHead>
				</TableHeadRow>
			{/snippet}

			{#snippet tableRows()}
				{#each scannedProducts as product (product.serialNo)}
					<TableCellRow
						class={twMerge(
							nonExistingErrorProducts?.find((p) => p.serialNo === product.serialNo) &&
								'animate-pulse bg-red-300 hover:bg-red-400'
						)}
					>
						<TableCell class="w-16 text-center">
							<GhostButton
								class="p-1"
								--color-ghostButton="var(--color-red-600)"
								onclick={() => {
									scannedProducts = scannedProducts.filter((p) => p !== product)
									localStorage.setItem('scannedNewProducts', JSON.stringify(scannedProducts))
								}}><MinusIcon /></GhostButton
							>
						</TableCell>
						<TableCell class="w-16 py-2">
							{#if product.serialNo}
								<TextBlock>{product.serialNo}</TextBlock>
							{:else}
								N/A
							{/if}
						</TableCell>

						<TableCell class="w-56 py-2">
							{#if product.macID}
								<TextBlock>{product.macID}</TextBlock>
							{:else}
								N/A
							{/if}
						</TableCell>

						<TableCell></TableCell>
					</TableCellRow>
				{:else}
					<TableCellRow class="hover:bg-white">
						<TableCell colspan={4} class="p-0">
							<Alert type="warning" hideIcon class="w-full justify-center">
								Scanned products will start appearing here.
							</Alert>
						</TableCell>
					</TableCellRow>
				{/each}
			{/snippet}
		</Table>

		<div class="flex flex-col gap-4 overflow-auto p-4 lg:col-span-2 lg:max-h-[calc(100%)] lg:gap-8">
			<div class="flex flex-col gap-4">
				<h2 class="font-semibold">Reseller</h2>
				<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
					<SelectInput
						isRequired
						name="resellerID"
						label="Reseller"
						loadMoreUrl="/_api/autocomplete/resellers"
						classContainer="py-2"
					/>
					<TextInput isRequired name="resellerInvoiceNo" label="Invoice Number" />
					<DateInput
						isRequired
						label="Purchase Date"
						name="resellerPurchaseDt"
						value={new Date()}
					/>
					<DateInput
						isRequired
						label="Warranty Expiry Date"
						name="resellerWarrantyExpiryDt"
						value={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
					/>
				</div>
			</div>

			<TextareaInput name="notes" label="Notes" />
		</div>
	</div>
</form>
