<script lang="ts">
	import ViewNotes from '$lib/components/views/ViewNotes.svelte'
	import ViewAuditTrail from '$lib/components/views/ViewAuditTrail.svelte'

	import { Alert } from '$sveltewind/components/display'
	import {
		DateEditForm,
		TextEditForm,
		SelectEditForm,
		ToggleEditForm,
		ConfirmForm
	} from '$sveltewind/components/forms'
	import { SolidButton } from '$sveltewind/components/buttons'
	import { TrashIcon } from '$sveltewind/icons'

	import ServiceLink from '$lib/components/links/ServiceLink.svelte'
	import ServiceTypeLink from '$lib/components/links/ServiceTypeLink.svelte'
	import NameDetailsLink from '$lib/components/links/NameDetailsLink.svelte'
	import CustomerLink from '$lib/components/links/CustomerLink.svelte'

	import { page } from '$app/state'
	import TextBlock from '$sveltewind/components/display/TextBlock.svelte'

	let { data } = $props()
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
						<h2 class="font-semibold">Basic Info</h2>
						<DateEditForm
							isRequired
							name="date"
							label="Date"
							value={data.transaction.date}
							action={`/billing/transactions/${data.transaction.id}?/updateTransactionDate`}
							successMessage="Successfully updated date."
						/>
						<TextEditForm
							isRequired={data.transaction.transactionType !== 'REVERSE'}
							name="transactionNumber"
							label="Transaction Number"
							value={data.transaction.transactionNumber}
							action={`/billing/transactions/${data.transaction.id}?/updateTransactionNumber`}
							successMessage="Successfully updated transaction number."
						/>
						<SelectEditForm
							isRequired
							name="transactionType"
							label="Transaction Type"
							value={data.transaction.transactionType}
							loadMoreUrl="/_api/autocomplete/billingTransactionTypes"
							action={`/billing/transactions/${data.transaction.id}?/updateTransactionType`}
							successMessage="Successfully updated transaction type."
						/>
						<SelectEditForm
							name="shipmentID"
							label="Shipment"
							value={data.transaction.shipment?.id}
							loadMoreUrl="/_api/autocomplete/shipments"
							action={`/billing/transactions/${data.transaction.id}?/updateTransactionShipment`}
							successMessage="Successfully updated shipment."
							hideCopyButton
						>
							{#snippet valueSnippet()}
								<NameDetailsLink path="/billing/shipments" record={data.transaction.shipment} />
							{/snippet}
						</SelectEditForm>
						<ToggleEditForm
							name="isFromCall"
							label="Is From Call"
							value={data.transaction.isFromCall}
							action={`/billing/transactions/${data.transaction.id}?/updateTransactionIsFromCall`}
							successMessage="Successfully updated is from call."
						/>
					</div>
				</div>

				<div class="flex flex-col gap-4 lg:gap-8">
					<div class="flex flex-col gap-4 text-sm">
						<h2 class="text-base font-semibold">Other Info</h2>
						<div
							class="grid w-full grid-cols-3 items-center gap-2 rounded-md bg-slate-100 px-4 py-3.5 hover:bg-slate-50"
						>
							<div class="pl-1 text-left">Credits:</div>
							<div class="col-span-2 flex-nowrap overflow-x-auto">
								<div class="flex justify-end text-right">
									<TextBlock class="text-lg font-bold">
										{data.transaction.credits.toString().padStart(2, '0')}
									</TextBlock>
								</div>
							</div>
						</div>
						<div
							class="grid w-full grid-cols-3 items-center gap-2 rounded-md bg-slate-100 px-4 py-3.5 hover:bg-slate-50"
						>
							<div class="pl-1 text-left">Service:</div>
							<div class="col-span-2 flex-nowrap overflow-x-auto">
								<div class="flex justify-end text-right">
									<ServiceLink service={data.transaction.service} />
								</div>
							</div>
						</div>
						<div
							class="grid w-full grid-cols-3 items-center gap-2 rounded-md bg-slate-100 px-4 py-3.5 hover:bg-slate-50"
						>
							<div class="pl-1 text-left">Service Type:</div>
							<div class="col-span-2 flex-nowrap overflow-x-auto">
								<div class="flex justify-end text-right">
									<ServiceTypeLink serviceType={data.transaction.serviceType} />
								</div>
							</div>
						</div>
						<div
							class="grid w-full grid-cols-3 items-center gap-2 rounded-md bg-slate-100 px-4 py-3.5 hover:bg-slate-50"
						>
							<div class="pl-1 text-left">Customer:</div>
							<div class="col-span-2 flex-nowrap overflow-x-auto">
								<div class="flex flex-col justify-end text-right">
									<CustomerLink customer={data.transaction.customer} class="w-full justify-end" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="flex flex-col gap-4 p-2 lg:col-span-2 lg:gap-8">
			<ViewNotes
				searchQuery={`?transactionID=${page.params.id}`}
				newNoteFormAction="/notes?/addTransactionNote"
			/>

			<ViewAuditTrail object={data.transaction} />

			<ConfirmForm
				label="Delete Transaction"
				action={`/billing/transactions/${data.transaction.id}?/deleteTransaction`}
				successMessage="Successfully deleted the transaction."
			>
				{#snippet trigger({ onclick })}
					<SolidButton
						{onclick}
						--color-solidButton="var(--color-red-600)"
						isDisabled={!(
							data.session.isAdmin ||
							data.session.permissions.find(
								(p) => p.app === 'BILLING' && p.permissionType === 'DELETE_TRANSACTION'
							)
						)}
					>
						<TrashIcon class="mr-1" />
						<span>Delete Transaction</span>
					</SolidButton>
				{/snippet}
				{#snippet fields()}
					<p class="text-sm">Are you sure you want to delete this transaction?</p>
				{/snippet}
			</ConfirmForm>
		</div>
	</div>
{/if}
