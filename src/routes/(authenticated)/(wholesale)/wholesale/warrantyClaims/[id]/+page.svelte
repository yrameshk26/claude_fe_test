<script lang="ts" module>
	type Props = {
		data: App.PageData & {
			[key: string]: any
		}
	}
</script>

<script lang="ts">
	import ViewNotes from '$lib/components/views/ViewNotes.svelte'
	import ViewAuditTrail from '$lib/components/views/ViewAuditTrail.svelte'

	import { Alert } from '$sveltewind/components/display'
	import { DateEditForm, SelectEditForm, ConfirmForm } from '$sveltewind/components/forms'
	import { SolidButton } from '$sveltewind/components/buttons'
	import { TrashIcon } from '$sveltewind/icons'

	import ProductLink from '$lib/components/links/ProductLink.svelte'

	import { page } from '$app/state'
	import { twMerge } from 'tailwind-merge'

	let { data }: Props = $props()
</script>

{#if data.errors}
	{#each data.errors as error (error)}
		<Alert type="error">{error}</Alert>
	{/each}
{:else}
	<div class="grid gap-4 lg:grid-cols-7 lg:gap-8">
		<div class="p-2 lg:col-span-5">
			<div class="grid gap-4 lg:grid-cols-2 lg:gap-8">
				<div class="flex flex-col gap-4 lg:gap-8">
					<div class="flex flex-col gap-4">
						<SelectEditForm
							isRequired
							name="productID"
							label="Product"
							value={data.warrantyClaim.productID}
							loadMoreUrl="/_api/autocomplete/products"
							action={`/wholesale/warrantyClaims/${data.warrantyClaim.id}?/updateWarrantyClaimProduct`}
							successMessage="Successfully updated Warranty Claim product."
							hideCopyButton
						>
							{#snippet valueSnippet()}
								<ProductLink product={data.warrantyClaim.product} />
							{/snippet}
						</SelectEditForm>
						<SelectEditForm
							isRequired
							name="status"
							label="Status"
							value={data.warrantyClaim.status}
							options={[
								{ label: 'Pending', value: 'PENDING' },
								{ label: 'Approved', value: 'APPROVED' },
								{ label: 'Denied', value: 'DENIED' }
							]}
							action={`/wholesale/warrantyClaims/${data.warrantyClaim.id}?/updateWarrantyClaimStatus`}
							successMessage="Successfully updated Warranty Claim status."
						>
							{#snippet valueSnippet()}
								<div class="flex items-center gap-2 pt-1">
									<div
										class={twMerge(
											'inline-block h-4 w-4 rounded-full',
											data.warrantyClaim.status === 'PENDING' && 'bg-yellow-500',
											data.warrantyClaim.status === 'APPROVED' && 'bg-green-500',
											data.warrantyClaim.status === 'DENIED' && 'bg-red-500'
										)}
									></div>
									{data.warrantyClaim.status.replace(/_/g, ' ') || '-'}
								</div>
							{/snippet}
						</SelectEditForm>
						<DateEditForm
							isRequired
							name="returnedDate"
							label="Returned Date"
							value={data.warrantyClaim.returnedDate}
							action={`/wholesale/warrantyClaims/${data.warrantyClaim.id}?/updateWarrantyClaimReturnedDate`}
							successMessage="Successfully updated Warranty Claim returned date."
						/>
					</div>
				</div>

				<div class="flex flex-col gap-4 lg:gap-8">
					<ViewNotes
						searchQuery={`?warrantyClaimID=${page.params.id}`}
						newNoteFormAction="/notes?/addWarrantyClaimNote"
					/>
				</div>
			</div>
		</div>

		<div class="flex flex-col gap-4 p-2 lg:col-span-2 lg:gap-8">
			<ViewAuditTrail object={data.warrantyClaim} />

			<ConfirmForm
				label="Delete Warranty Claim"
				action={`/wholesale/warrantyClaims/${data.warrantyClaim.id}?/deleteWarrantyClaim`}
				successMessage="Successfully deleted the Warranty Claim."
			>
				{#snippet trigger({ onclick })}
					<SolidButton
						{onclick}
						--color-solidButton="var(--color-red-600)"
						isDisabled={!(
							data.session.isAdmin ||
							data.session.permissions.find(
								(p) => p.app === 'WHOLESALE' && p.permissionType === 'DELETE_WARRANTY_CLAIM'
							)
						)}
					>
						<TrashIcon class="mr-1" />
						<span>Delete Warranty Claim</span>
					</SolidButton>
				{/snippet}
				{#snippet fields()}
					<p class="text-sm">Are you sure you want to delete this Warranty Claim?</p>
				{/snippet}
			</ConfirmForm>
		</div>
	</div>
{/if}
