<script lang="ts" module>
	type Props = {
		data: App.PageData & {
			[key: string]: any
		}
		viewPath: string
		permissionType: 'VENDOR' | 'RESELLER'
		key: 'Reseller' | 'Vendor'
	}
</script>

<script lang="ts">
	import ViewAuditTrail from '$lib/components/views/ViewAuditTrail.svelte'

	import { Alert } from '$sveltewind/components/display'
	import { TextEditForm, AddressEditForm, ConfirmForm } from '$sveltewind/components/forms'
	import { SolidButton } from '$sveltewind/components/buttons'
	import { TrashIcon } from '$sveltewind/icons'

	let { data, viewPath, permissionType, key }: Props = $props()
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
						<TextEditForm
							isRequired
							name="name"
							label="Name"
							value={data[key.toLowerCase()].name}
							action={`${viewPath}/${data[key.toLowerCase()].id}?/updateName`}
							successMessage="Successfully updated name."
						/>
						<TextEditForm
							name="email"
							label="Email"
							type="email"
							value={data[key.toLowerCase()].email}
							action={`${viewPath}/${data[key.toLowerCase()].id}?/updateEmail`}
							successMessage="Successfully updated email."
						/>
						<TextEditForm
							name="phoneNo"
							label="Phone No"
							value={data[key.toLowerCase()].phoneNo}
							maskitoOptions={{
								mask: ['+', '1', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]
							}}
							action={`${viewPath}/${data[key.toLowerCase()].id}?/updatePhoneNo`}
							successMessage="Successfully updated phone no."
						/>
					</div>
				</div>

				<div class="flex flex-col gap-4 lg:gap-8">
					<div class="flex flex-col gap-4">
						<h2 class="font-semibold">Other Info</h2>
						<AddressEditForm
							name="address"
							label="Address"
							value={data[key.toLowerCase()].address}
							action={`${viewPath}/${data[key.toLowerCase()].id}?/updateAddress`}
							successMessage="Successfully updated address."
						/>
						<TextEditForm
							name="details"
							label="Details"
							value={data[key.toLowerCase()].details}
							action={`${viewPath}/${data[key.toLowerCase()].id}?/updateDetails`}
							successMessage="Successfully updated details."
						/>
					</div>
				</div>
			</div>
		</div>

		<div class="flex flex-col gap-4 p-2 lg:col-span-2 lg:gap-8">
			<ViewAuditTrail object={data[key.toLowerCase()]} />

			<ConfirmForm
				label="Delete {key}"
				action={`${viewPath}/${data[key.toLowerCase()].id}?/delete`}
				successMessage="Successfully deleted the {key}."
			>
				{#snippet trigger({ onclick })}
					<SolidButton
						{onclick}
						--color-solidButton="var(--color-red-600)"
						isDisabled={!(
							data.session.isAdmin ||
							data.session.permissions.find(
								(p) => p.app === 'WHOLESALE' && p.permissionType === `DELETE_${permissionType}`
							)
						)}
					>
						<TrashIcon class="mr-1" />
						<span>Delete {key}</span>
					</SolidButton>
				{/snippet}
				{#snippet fields()}
					<p class="text-sm">Are you sure you want to delete this {key}?</p>
				{/snippet}
			</ConfirmForm>
		</div>
	</div>
{/if}
