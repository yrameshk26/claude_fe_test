<script lang="ts" module>
	type Props = {
		userID?: string
		customerID?: string
		dailyReportLogID?: string
		hideCustomer?: boolean
		hideDailyReportLog?: boolean
		isInline?: boolean
	}
</script>

<script lang="ts">
	import { NewForm } from '$sveltewind/components/forms'
	import { SolidButton, GhostButton } from '$sveltewind/components/buttons'
	import { DateInput, TextareaInput, SelectInput } from '$sveltewind/components/inputs'
	import { PlusIcon } from '$sveltewind/icons'

	import UserSelectInput from '../UserSelectInput.svelte'
	import { twMerge } from 'tailwind-merge'
	let {
		userID,
		customerID,
		dailyReportLogID,
		hideCustomer,
		hideDailyReportLog,
		isInline = false
	}: Props = $props()
</script>

<NewForm
	label="Create a new ticket"
	action="/tickets?/createTicket"
	successMessage="Successfully created a new ticket."
>
	{#snippet trigger({ onclick })}
		{#if !isInline}
			<SolidButton {onclick} class="text-xs">
				<PlusIcon class="mr-1 size-4" />
				New
			</SolidButton>
		{:else}
			<GhostButton
				{onclick}
				class="p-1"
				--color-ghostButton="var(--color-blue-700)"
				hideDisabledIcon
			>
				<PlusIcon class="size-4" />
				<span class="sr-only">New</span>
			</GhostButton>
		{/if}
	{/snippet}
	{#snippet fields()}
		<div class="flex flex-col gap-6">
			<div
				class={twMerge(
					'grid grid-cols-1 gap-4',
					!userID &&
						!dailyReportLogID &&
						!hideCustomer &&
						!userID &&
						!customerID &&
						!hideDailyReportLog &&
						'grid-cols-2'
				)}
			>
				{#if !userID && !dailyReportLogID && !hideCustomer}
					<SelectInput
						isDisabled={!!customerID}
						hideDisabledIcon
						name="customerID"
						label="Customer"
						value={customerID}
						loadMoreUrl="/_api/autocomplete/customers"
					/>
				{/if}
				{#if !userID && !customerID && !hideDailyReportLog}
					<SelectInput
						isDisabled={!!dailyReportLogID}
						hideDisabledIcon
						name="dailyReportLogID"
						label="Daily Report Log"
						value={dailyReportLogID}
						loadMoreUrl="/_api/autocomplete/dailyReportLogs"
					/>
				{/if}
			</div>
			<SelectInput
				isRequired
				name="subjectID"
				label="Ticket Subject"
				loadMoreUrl="/_api/autocomplete/ticketSubjects"
			/>
			<TextareaInput isRequired name="details" label="Details" rows={4} />
			{#if !userID}
				<UserSelectInput name="assignedToUserID" label="Assigned To" />
			{:else}
				<UserSelectInput isDisabled name="assignedToUserID" label="Assigned To" value={userID} />
			{/if}
			<DateInput
				name="expiresAt"
				label="Expires At"
				value={new Date(new Date().setDate(new Date().getDate() + 14))}
			/>
		</div>
	{/snippet}
</NewForm>
