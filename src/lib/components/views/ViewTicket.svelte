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

	import NameDetailsLink from '$lib/components/links/NameDetailsLink.svelte'
	import CustomerLink from '$lib/components/links/CustomerLink.svelte'
	import DailyReportLogLink from '$lib/components/links/DailyReportLogLink.svelte'
	import UserLink from '$lib/components/links/UserLink.svelte'

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
							name="subjectID"
							label="Subject"
							value={data.ticket.subjectID}
							loadMoreUrl="/_api/autocomplete/ticketSubjects"
							action={`/tickets/${data.ticket.id}?/updateTicketSubject`}
							successMessage="Successfully updated ticket subject."
							hideCopyButton
						>
							{#snippet valueSnippet()}
								<NameDetailsLink
									path="/management/settings/ticketSubjects"
									record={data.ticket.subject}
								/>
							{/snippet}
						</SelectEditForm>
						<SelectEditForm
							isRequired
							name="status"
							label="Status"
							value={data.ticket.status}
							options={[
								{ label: 'Open', value: 'OPEN' },
								{ label: 'In Progress', value: 'IN_PROGRESS' },
								{ label: 'Resolved', value: 'RESOLVED' }
							]}
							action={`/tickets/${data.ticket.id}?/updateTicketStatus`}
							successMessage="Successfully updated ticket status."
						>
							{#snippet valueSnippet()}
								<div class="flex items-center gap-2 pt-1">
									<div
										class={twMerge(
											'inline-block h-4 w-4 rounded-full',
											data.ticket.status === 'OPEN' && 'bg-red-500',
											data.ticket.status === 'IN_PROGRESS' && 'bg-yellow-500',
											data.ticket.status === 'RESOLVED' && 'bg-green-500'
										)}
									></div>
									{data.ticket.status.replace(/_/g, ' ') || '-'}
								</div>
							{/snippet}
						</SelectEditForm>
						<DateEditForm
							isRequired
							name="expiresAt"
							label="Expiry Date"
							value={data.ticket.expiresAt}
							action={`/tickets/${data.ticket.id}?/updateTicketExpiryDate`}
							successMessage="Successfully updated ticket expiry date."
						/>

						<SelectEditForm
							isRequired
							name="assignedToUserID"
							label="Assigned To User"
							value={data.ticket.assignedToUserID}
							loadMoreUrl="/_api/autocomplete/users"
							action={`/tickets/${data.ticket.id}?/updateTicketAssignedTo`}
							successMessage="Successfully updated ticket assigned to user."
						>
							{#snippet valueSnippet()}
								<UserLink user={data.ticket.assignedToUser} />
							{/snippet}
						</SelectEditForm>
					</div>
				</div>

				<div class="flex flex-col gap-4 lg:gap-8">
					<ViewNotes
						searchQuery={`?ticketID=${page.params.id}`}
						newNoteFormAction="/notes?/addTicketNote"
					/>
				</div>
			</div>
		</div>

		<div class="flex flex-col gap-4 p-2 lg:col-span-2 lg:gap-8">
			{#if data.ticket.customer || data.ticket.dailyReportLog}
				<div
					class="grid w-full grid-cols-2 items-center gap-2 rounded-md bg-slate-100 px-4 py-3.5 text-sm hover:bg-slate-50"
				>
					<div class="pl-1 text-left font-semibold">
						{#if data.ticket.customer}
							Customer
						{:else if data.ticket.dailyReportLog}
							Daily Report Log
						{/if}
					</div>
					<div class="flex-nowrap justify-self-end overflow-x-auto">
						<div class="flex flex-col justify-end text-right">
							{#if data.ticket.customer}
								<CustomerLink customer={data.ticket.customer} />
							{:else if data.ticket.dailyReportLog}
								<DailyReportLogLink dailyReportLog={data.ticket.dailyReportLog} />
							{/if}
						</div>
					</div>
				</div>
			{/if}

			<ViewAuditTrail object={data.ticket} />

			<ConfirmForm
				label="Delete Ticket"
				action={`/tickets/${data.ticket.id}?/deleteTicket`}
				successMessage="Successfully deleted the ticket."
			>
				{#snippet trigger({ onclick })}
					<SolidButton
						{onclick}
						--color-solidButton="var(--color-red-600)"
						isDisabled={!(
							data.session.isAdmin ||
							data.session.permissions.find(
								(p) => p.app === 'BILLING' && p.permissionType === 'DELETE_SUPPORT_TICKET'
							)
						)}
					>
						<TrashIcon class="mr-1" />
						<span>Delete Ticket</span>
					</SolidButton>
				{/snippet}
				{#snippet fields()}
					<p class="text-sm">Are you sure you want to delete this ticket?</p>
				{/snippet}
			</ConfirmForm>
		</div>
	</div>
{/if}
