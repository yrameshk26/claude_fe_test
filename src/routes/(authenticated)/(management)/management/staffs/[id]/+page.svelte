<script lang="ts">
	import ViewPhoneNumbers from '$lib/components/views/ViewPhoneNumbers.svelte'
	import ViewAuditTrail from '$lib/components/views/ViewAuditTrail.svelte'

	import { Alert } from '$sveltewind/components/display'
	import { TextEditForm, ToggleEditForm, ConfirmForm, NewForm } from '$sveltewind/components/forms'
	import { SolidButton } from '$sveltewind/components/buttons'
	import { TrashIcon, RefreshIcon } from '$sveltewind/icons'
	import { PasswordInput } from '$sveltewind/components/inputs'

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
							name="fullName"
							label="Full Name"
							value={data.user.fullName}
							action={`/management/staffs/${data.user.id}?/updateUserFullName`}
							successMessage="Successfully updated full name."
						/>
						<TextEditForm
							isRequired
							type="email"
							name="email"
							label="Email"
							value={data.user.email}
							action={`/management/staffs/${data.user.id}?/updateUserEmail`}
							successMessage="Successfully updated email."
						/>
						<NewForm
							label="Reset Password"
							action={`/management/staffs/${data.user.id}?/resetUserPassword`}
							successMessage="Successfully reset staff password."
						>
							{#snippet trigger({ onclick })}
								<div>
									<SolidButton
										{onclick}
										class="w-full"
										--color-solidButton="var(--color-orange-600)"
									>
										<RefreshIcon class="mr-1 size-4" /> Reset Password
									</SolidButton>
								</div>
							{/snippet}

							{#snippet fields()}
								<div class="flex flex-col gap-6">
									<PasswordInput isRequired name="password" label="New Password" />
									<PasswordInput isRequired name="confirmPassword" label="Confirm Password" />
									<Alert type="warning">
										This will reset the password for this staff and logout from all sessions.
									</Alert>
								</div>
							{/snippet}
						</NewForm>
					</div>
				</div>

				<div class="flex flex-col gap-4 lg:col-span-2 lg:gap-8">
					<div class="flex flex-col gap-4">
						<h2 class="font-semibold">Phone Numbers</h2>
						<ViewPhoneNumbers
							phoneNumbers={data.user.phoneNumbers}
							newPhoneNumberFormAction="/phoneNumbers?/addUserPhoneNumber"
							additionalFormData={{ userID: data.user.id }}
						/>
					</div>

					<div class="flex flex-col gap-4">
						<h2 class="font-semibold">Status</h2>
						<div class="grid grid-cols-2 justify-between gap-8">
							<ToggleEditForm
								name="isLocked"
								label="Is Locked"
								value={data.user.isLocked}
								action={`/management/staffs/${data.user.id}?/updateUserIsLocked`}
								successMessage="Successfully updated locked status."
							/>
							<ToggleEditForm
								name="requiredOTP"
								label="Require OTP"
								value={data.user.requiredOTP}
								action={`/management/staffs/${data.user.id}?/updateUserRequiredOTP`}
								successMessage="Successfully updated required OTP status."
							/>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="flex flex-col gap-4 p-2 lg:col-span-2 lg:gap-8">
			<ToggleEditForm
				name="isAdmin"
				label="Is Admin"
				value={data.user.isAdmin}
				action={`/management/staffs/${data.user.id}?/updateUserIsAdmin`}
				successMessage="Successfully updated admin status."
			/>
			<ViewAuditTrail object={data.user} />

			<ConfirmForm
				label="Delete User"
				action={`/management/staffs/${data.user.id}?/deleteUser`}
				successMessage="Successfully deleted the staff."
			>
				{#snippet trigger({ onclick })}
					<SolidButton
						{onclick}
						--color-solidButton="var(--color-red-600)"
						isDisabled={!(
							data.session.isAdmin ||
							data.session.permissions.find(
								(p) => p.app === 'MANAGEMENT' && p.permissionType === 'DELETE_STAFF'
							)
						)}
					>
						<TrashIcon class="mr-1" />
						<span>Delete Staff</span>
					</SolidButton>
				{/snippet}
				{#snippet fields()}
					<p class="text-sm">Are you sure you want to delete this staff?</p>
				{/snippet}
			</ConfirmForm>
		</div>
	</div>
{/if}
