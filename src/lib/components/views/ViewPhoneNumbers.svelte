<script lang="ts" module>
	type Props = {
		newPhoneNumberFormAction: string
		additionalFormData?: Record<string, string | File>
		phoneNumbers: PhoneNumberType[]
	}

	type PhoneNumberType = {
		id: string
		type: string
		value: string
		isPrimary: boolean
	}
</script>

<script lang="ts">
	import {
		Table,
		TableHeadRow,
		TableHead,
		TableCellRow,
		TableCell
	} from '$sveltewind/components/table'
	import { GhostButton } from '$sveltewind/components/buttons'

	import {
		NewForm,
		TextEditForm,
		SelectEditForm,
		ToggleEditForm,
		ConfirmForm
	} from '$sveltewind/components/forms'

	import { SelectInput, TextInput } from '$sveltewind/components/inputs'
	import { TrashIcon, PlusIcon } from '$sveltewind/icons'

	let { newPhoneNumberFormAction, additionalFormData, phoneNumbers = [] }: Props = $props()
</script>

<div class="grid grid-cols-1 gap-y-8">
	{#if phoneNumbers}
		<Table classContainer="h-full">
			{#snippet tableHead()}
				<TableHeadRow>
					<TableHead class="min-w-44">Type</TableHead>
					<TableHead class="min-w-56">Number</TableHead>
					<TableHead class="min-w-28">Is Primary</TableHead>
					<TableHead class="min-w-0"></TableHead>
				</TableHeadRow>
			{/snippet}

			{#snippet tableRows()}
				{#each phoneNumbers as phoneNumber (phoneNumber.id)}
					<TableCellRow class="h-14">
						<TableCell
							><SelectEditForm
								isRequired
								name="type"
								value={phoneNumber.type}
								options={[
									{ label: 'Mobile', value: 'MOBILE' },
									{ label: 'Landline', value: 'LANDLINE' },
									{ label: 'Business', value: 'BUSINESS' }
								]}
								action={`/phoneNumbers/${phoneNumber.id}?/updatePhoneNumberType`}
								successMessage="Successfully updated phone number type."
							/>
						</TableCell>
						<TableCell
							><TextEditForm
								isRequired
								name="value"
								value={phoneNumber.value}
								action={`/phoneNumbers/${phoneNumber.id}?/updatePhoneNumberValue`}
								successMessage="Successfully updated phone number value."
								maskitoOptions={{
									mask: [
										'+',
										/\d/,
										/\d/,
										/\d/,
										/\d/,
										/\d/,
										/\d/,
										/\d/,
										/\d/,
										/\d/,
										/\d/,
										/\d/,
										/\d/,
										/\d/,
										/\d/,
										/\d/
									]
								}}
								classForm="col-span-2"
							/></TableCell
						>
						<TableCell
							><ToggleEditForm
								name="isPrimary"
								value={phoneNumber.isPrimary}
								action={`/phoneNumbers/${phoneNumber.id}?/updatePrimaryPhoneNumber`}
								successMessage="Successfully updated primary phone number."
							/></TableCell
						>
						<TableCell
							><ConfirmForm
								label="Delete Phone Number"
								action={`/phoneNumbers/${phoneNumber.id}?/deletePhoneNumber`}
								successMessage="Successfully deleted phone number."
							>
								{#snippet trigger({ onclick })}
									<div>
										<GhostButton
											{onclick}
											--color-ghostButton="var(--color-red-600)"
											class="text-xs"
										>
											<TrashIcon class="size-4" />
											<span class="sr-only">Delete</span>
										</GhostButton>
									</div>
								{/snippet}
								{#snippet fields()}
									<p class="text-sm">Are you sure you want to delete this phone number?</p>
								{/snippet}
							</ConfirmForm></TableCell
						>
					</TableCellRow>
				{/each}
			{/snippet}
		</Table>
	{/if}

	<NewForm
		label="Add a new Phone Number"
		action={newPhoneNumberFormAction}
		successMessage="Successfully added new phone number."
		{additionalFormData}
	>
		{#snippet trigger({ onclick })}
			<div class="-mt-6">
				<GhostButton {onclick} class="p-1.5 text-xs" --color-ghostButton="var(--color-blue-600)">
					<PlusIcon />Add New
				</GhostButton>
			</div>
		{/snippet}

		{#snippet fields()}
			<div class="flex flex-col gap-6">
				<SelectInput
					isRequired
					name="type"
					label="Type"
					value="MOBILE"
					options={[
						{ label: 'Mobile', value: 'MOBILE' },
						{ label: 'Landline', value: 'LANDLINE' },
						{ label: 'Business', value: 'BUSINESS' }
					]}
				/>
				<SelectInput
					isRequired
					name="countryCode"
					label="Country Code"
					value="+1"
					loadMoreUrl="/_api/autocomplete/countryCodes"
				/>
				<TextInput
					isRequired
					name="value"
					label="Value"
					autofocus
					maskitoOptions={{
						mask: [
							/\d/,
							/\d/,
							/\d/,
							/\d/,
							/\d/,
							/\d/,
							/\d/,
							/\d/,
							/\d/,
							/\d/,
							/\d/,
							/\d/,
							/\d/,
							/\d/
						]
					}}
				/>
			</div>
		{/snippet}
	</NewForm>
</div>
