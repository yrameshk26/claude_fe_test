<script lang="ts">
	import ViewNotes from '$lib/components/views/ViewNotes.svelte'
	import ViewAuditTrail from '$lib/components/views/ViewAuditTrail.svelte'

	import { Alert } from '$sveltewind/components/display'
	import {
		DateEditForm,
		TextEditForm,
		SelectEditForm,
		ConfirmForm
	} from '$sveltewind/components/forms'
	import { SolidButton } from '$sveltewind/components/buttons'
	import { TrashIcon } from '$sveltewind/icons'

	import { page } from '$app/state'
	import NameDetailsLink from '$lib/components/links/NameDetailsLink.svelte'
	import WholesalerLink from '$lib/components/links/WholesalerLink.svelte'

	let { data } = $props()
</script>

{#if data.errors}
	{#each data.errors as error (error)}
		<Alert type="error">{error}</Alert>
	{/each}
{:else}
	<div class="grid gap-4 lg:grid-cols-7 lg:gap-8">
		<div class="p-2 lg:col-span-5">
			<div class="grid gap-4 lg:grid-cols-3 lg:gap-8">
				<div class="flex flex-col gap-4 lg:gap-8">
					<div class="flex flex-col gap-4">
						<h2 class="font-semibold">Basic Info</h2>
						<TextEditForm
							isRequired
							name="serialNo"
							label="Serial Number"
							value={data.product.serialNo}
							action={`/wholesale/products/${data.product.id}?/updateProductSerialNo`}
							successMessage="Successfully updated serial number."
						/>
						<TextEditForm
							name="macID"
							label="MAC ID"
							value={data.product.macID}
							maskitoOptions={{
								mask: [
									/\w/,
									/\w/,
									':',
									/\w/,
									/\w/,
									':',
									/\w/,
									/\w/,
									':',
									/\w/,
									/\w/,
									':',
									/\w/,
									/\w/,
									':',
									/\w/,
									/\w/
								]
							}}
							action={`/wholesale/products/${data.product.id}?/updateProductMacID`}
							successMessage="Successfully updated MAC ID."
						/>
						<SelectEditForm
							name="productTypeID"
							label="Product Type"
							value={data.product.productType?.id}
							loadMoreUrl="/_api/autocomplete/productTypes"
							action={`/wholesale/products/${data.product.id}?/updateProductProductType`}
							successMessage="Successfully updated product type."
						>
							{#snippet valueSnippet()}
								<NameDetailsLink path="/wholesale/products" record={data.product.productType} />
							{/snippet}
						</SelectEditForm>
					</div>
				</div>

				<div class="flex flex-col gap-4 lg:col-span-2 lg:gap-8">
					<div class="flex flex-col gap-4">
						<h2 class="font-semibold">Vendor</h2>
						<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
							<SelectEditForm
								isRequired
								name="vendorID"
								label="Vendor Name"
								value={data.product.vendor.id}
								loadMoreUrl="/_api/autocomplete/vendors"
								action={`/wholesale/products/${data.product.id}?/updateProductVendor`}
								successMessage="Successfully updated vendor."
							>
								{#snippet valueSnippet()}
									<WholesalerLink
										path="/wholesale/vendors"
										record={data.product.vendor}
										class="flex-row items-center justify-between"
									/>
								{/snippet}
							</SelectEditForm>
							<TextEditForm
								isRequired
								name="vendorInvoiceNo"
								label="Vendor Invoice No."
								value={data.product.vendorInvoiceNo}
								action={`/wholesale/products/${data.product.id}?/updateProductVendorInvoiceNo`}
								successMessage="Successfully updated vendor invoice number."
							/>
							<DateEditForm
								isRequired
								name="vendorPurchaseDt"
								label="Purchase Date"
								value={data.product.vendorPurchaseDt}
								action={`/wholesale/products/${data.product.id}?/updateProductVendorPurchaseDt`}
								successMessage="Successfully updated purchase date."
							/>
							<DateEditForm
								isRequired
								name="vendorWarrantyExpiryDt"
								label="Warranty Expiry Date"
								value={data.product.vendorWarrantyExpiryDt}
								action={`/wholesale/products/${data.product.id}?/updateProductVendorWarrantyExpiryDt`}
								successMessage="Successfully updated warranty expiry date."
							/>
						</div>
					</div>

					<div class="flex flex-col gap-4">
						<h2 class="font-semibold">Reseller</h2>
						<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
							<SelectEditForm
								name="resellerID"
								label="Reseller Name"
								value={data.product.reseller?.id}
								loadMoreUrl="/_api/autocomplete/resellers"
								action={`/wholesale/products/${data.product.id}?/updateProductReseller`}
								successMessage="Successfully updated reseller."
								hideCopyButton
							>
								{#snippet valueSnippet()}
									{#if data.product.reseller}
										<WholesalerLink
											path="/wholesale/resellers"
											record={data.product.reseller}
											class="flex-row items-center justify-between"
										/>
									{:else}
										-
									{/if}
								{/snippet}
							</SelectEditForm>
							<TextEditForm
								name="resellerInvoiceNo"
								label="Reseller Invoice No."
								value={data.product.resellerInvoiceNo || ''}
								action={`/wholesale/products/${data.product.id}?/updateProductResellerInvoiceNo`}
								successMessage="Successfully updated reseller invoice number."
							/>
							<DateEditForm
								name="resellerPurchaseDt"
								label="Purchase Date"
								value={data.product.resellerPurchaseDt || ''}
								action={`/wholesale/products/${data.product.id}?/updateProductResellerPurchaseDt`}
								successMessage="Successfully updated purchase date."
							/>
							<DateEditForm
								name="resellerWarrantyExpiryDt"
								label="Warranty Expiry Date"
								value={data.product.resellerWarrantyExpiryDt || ''}
								action={`/wholesale/products/${data.product.id}?/updateProductResellerWarrantyExpiryDt`}
								successMessage="Successfully updated warranty expiry date."
							/>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="flex flex-col gap-4 p-2 lg:col-span-2 lg:gap-8">
			<ViewNotes
				searchQuery={`?productID=${page.params.id}`}
				newNoteFormAction="/notes?/addProductNote"
			/>

			<ViewAuditTrail object={data.product} />

			<ConfirmForm
				label="Delete Product"
				action={`/wholesale/products/${data.product.id}?/deleteProduct`}
				successMessage="Successfully deleted the product."
			>
				{#snippet trigger({ onclick })}
					<SolidButton
						{onclick}
						--color-solidButton="var(--color-red-600)"
						isDisabled={!(
							data.session.isAdmin ||
							data.session.permissions.find(
								(p) => p.app === 'WHOLESALE' && p.permissionType === 'DELETE_PRODUCT'
							)
						)}
					>
						<TrashIcon class="mr-1" />
						<span>Delete Product</span>
					</SolidButton>
				{/snippet}
				{#snippet fields()}
					<p class="text-sm">Are you sure you want to delete this product?</p>
				{/snippet}
			</ConfirmForm>
		</div>
	</div>
{/if}
