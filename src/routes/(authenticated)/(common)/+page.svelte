<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'

	import { Sidebar } from '$sveltewind/components/layouts'

	import {
		Table,
		TableHeadRow,
		TableHead,
		TableCellRow,
		TableCell
	} from '$sveltewind/components/table'
	import { SolidButton, GhostButton } from '$sveltewind/components/buttons'
	import { Alert } from '$sveltewind/components/display'
	import { NewForm, TextEditForm, ImageEditForm, ConfirmForm } from '$sveltewind/components/forms'
	import { PasswordInput } from '$sveltewind/components/inputs'
	import { TrashIcon, RefreshIcon } from '$sveltewind/icons'
	import { LogoutIcon } from '$icons'

	import AppSwitcherMenu from '$lib/components/menu/AppSwitcherMenu.svelte'
	import ViewPhoneNumbers from '$lib/components/views/ViewPhoneNumbers.svelte'
	import ViewAuditTrail from '$lib/components/views/ViewAuditTrail.svelte'

	import { twMerge } from 'tailwind-merge'

	let { data } = $props()

	$effect(() => {
		headerState.title = 'My Account'
		headerState.class = 'bg-gradient-to-r from-indigo-900 to-blue-900'
	})
</script>

<Sidebar class="w-64 bg-gradient-to-b from-indigo-900 to-blue-900 text-white">
	<div class="flex h-full flex-col">
		<div class="flex w-full flex-col items-center justify-between py-2.5">
			<h1 class="w-full pt-2 text-center text-xl font-semibold tracking-wider text-white">
				TVUPWEB
			</h1>
		</div>
		<AppSwitcherMenu isInline />
		<div class="flex w-full flex-1 flex-col items-center justify-between py-2.5">
			<p></p>
			<div class="flex flex-col gap-1">
				<p class="text-center text-sm font-bold tracking-normal text-gray-200">
					v{import.meta.env.BUILD_VERSION}
				</p>
				<p class="ml-2 text-xs tracking-normal text-gray-200">
					Last Updated:
					<span class=""
						>{new Date(import.meta.env.BUILD_TIME).toLocaleString('en-CA', {
							year: 'numeric',
							month: '2-digit',
							day: '2-digit',
							hour: '2-digit',
							minute: '2-digit',
							second: '2-digit',
							hour12: false
						})}</span
					>
				</p>
			</div>
		</div>
	</div>
</Sidebar>

{#if data.errors}
	<div class="mx-auto grid max-w-lg gap-4 p-20">
		<Alert type="error">
			{#each data.errors as error (error)}
				<p>{error}</p>
			{/each}
		</Alert>
		<p class="mt-20 text-center text-sm">
			Please logout and try again. If the problem persists, contact support.
		</p>
		<SolidButton --color-solidButton="var(--color-red-600)" data-sveltekit-reload href="/logout"
			>Logout</SolidButton
		>
	</div>
{:else}
	<div class="relative h-[100%] overflow-auto lg:px-8">
		<div class="space-y-6">
			<div class="flex flex-col border-b border-gray-900/10 pb-6">
				<h2 class="mb-2 text-base leading-7 font-semibold text-gray-900">Active Sessions</h2>
				<Table classContainer="pb-4">
					{#snippet tableHead()}
						<TableHeadRow>
							<TableHead class="min-w-40">Logged In</TableHead>
							<TableHead class="min-w-44">Expires At</TableHead>
							<TableHead class="min-w-52">IP Address</TableHead>
							<TableHead class="min-w-28">Postal</TableHead>
							<TableHead class="min-w-36">City</TableHead>
							<TableHead class="min-w-24">Country</TableHead>
							<TableHead class="min-w-0"></TableHead>
						</TableHeadRow>
					{/snippet}
					{#snippet tableRows()}
						{#each data.myProfile.sessions as session (session.id)}
							<TableCellRow
								class={twMerge(
									'h-12',
									data.myProfile.sessions.length > 1 &&
										session.fingerprint === data.session.cookies.TVUPWEB_FINGERPRINT &&
										'bg-yellow-100 hover:bg-yellow-200'
								)}
							>
								<TableCell
									>{new Date(session.createdAt).toLocaleString('en-CA', {
										year: 'numeric',
										month: '2-digit',
										day: '2-digit',
										hour: '2-digit',
										minute: '2-digit',
										second: '2-digit',
										hour12: false
									})}</TableCell
								>
								<TableCell
									>{new Date(session.expiresAt).toLocaleString('en-CA', {
										year: 'numeric',
										month: '2-digit',
										day: '2-digit',
										hour: '2-digit',
										minute: '2-digit',
										second: '2-digit',
										hour12: false
									})}</TableCell
								>
								<TableCell>{session.fingerprint}</TableCell>
								<TableCell>{session.postal}</TableCell>
								<TableCell>{session.city}</TableCell>
								<TableCell>{session.country}</TableCell>
								<TableCell class="text-center">
									<NewForm
										action="?/deleteMySession"
										successMessage="Successfully deleted session."
										label="Logout Session"
										additionalFormData={{
											id: session.id
										}}
									>
										{#snippet trigger({ onclick })}
											<GhostButton
												{onclick}
												class="py-2 text-xs"
												--color-ghostButton="var(--color-red-600)"
											>
												<LogoutIcon class="mr-1 size-4" />
												Delete</GhostButton
											>
										{/snippet}
										{#snippet fields()}
											<p class="text-sm">Are you sure you want to logout from this session?</p>
										{/snippet}
									</NewForm>
								</TableCell>
							</TableCellRow>
						{/each}
					{/snippet}
				</Table>
				<ConfirmForm
					label="Delete all sessions"
					action="?/deleteAllMySessions"
					successMessage="Successfully deleted all sessions."
				>
					{#snippet trigger({ onclick })}
						<SolidButton
							{onclick}
							class="w-fit py-2 text-xs"
							--color-solidButton="var(--color-red-600)"
						>
							<TrashIcon class="mr-1 size-4" />
							Delete all sessions</SolidButton
						>
					{/snippet}
					{#snippet fields()}
						<p class="text-sm">
							Are you sure you want to delete all sessions? You will also be logged out from the
							current session.
						</p>
					{/snippet}
				</ConfirmForm>
			</div>

			<div class="border-b border-gray-900/10 pb-6">
				<h2 class="mb-2 text-base leading-7 font-semibold text-gray-900">My Profile</h2>
				<div class="col-span-full grid gap-4 lg:grid-cols-4">
					<div
						class="order-last col-span-3 flex w-full flex-col gap-6 justify-self-center p-4 lg:order-first"
					>
						<TextEditForm
							isRequired
							name="fullName"
							label="Full Name"
							value={data.myProfile.fullName}
							action="?/updateMyFullName"
							successMessage="Successfully updated your full name."
							additionalFormData={{ id: data.myProfile.id }}
						/>
						<TextEditForm
							isRequired
							type="email"
							name="email"
							label="Email"
							value={data.myProfile.email}
							action="?/updateMyEmail"
							successMessage="Successfully updated your email."
							additionalFormData={{ id: data.myProfile.id }}
						/>
						<NewForm
							label="Reset my password"
							action="?/resetMyPassword"
							successMessage="Successfully reset your password."
							additionalFormData={{ id: data.myProfile.id }}
						>
							{#snippet trigger({ onclick })}
								<div>
									<SolidButton {onclick} class="text-xs" --color-solidButton="var(--color-red-600)">
										<RefreshIcon class="mr-1 size-4" /> Reset my password
									</SolidButton>
								</div>
							{/snippet}

							{#snippet fields()}
								<div class="flex flex-col gap-6">
									<PasswordInput isRequired name="password" label="New Password" />
									<PasswordInput isRequired name="confirmPassword" label="Confirm Password" />
									<Alert type="warning">
										This will reset your password and log you out of from the current session.
									</Alert>
								</div>
							{/snippet}
						</NewForm>
					</div>
					<div
						class="col-span-4 mt-4 flex flex-col gap-1 justify-self-center lg:col-span-1 lg:mt-0"
					>
						<ImageEditForm
							name="image"
							value={data.myProfile.imageUrl}
							action="?/updateMyProfileImage"
							successMessage="Successfully updated your profile image."
							additionalFormData={{ id: data.myProfile.id }}
						/>
						{#if data.myProfile.imageUrl}
							<ConfirmForm
								label="Remove Profile Image"
								action="?/deleteMyProfileImage"
								successMessage="Successfully removed your profile image."
								additionalFormData={{ id: data.myProfile.id }}
							>
								{#snippet fields()}
									<p class="text-sm">Are you sure you want to remove your profile image?</p>
								{/snippet}
								{#snippet trigger({ onclick })}
									<GhostButton
										{onclick}
										class="px-2 py-2 text-xs"
										--color-ghostButton="var(--color-red-600)"
									>
										<TrashIcon class="mr-1 size-4" />Remove
									</GhostButton>
								{/snippet}
							</ConfirmForm>
						{/if}
					</div>
				</div>
			</div>

			<div class="@container">
				<h2 class="mb-2 text-base leading-7 font-semibold text-gray-900">My Phone Numbers</h2>
				<div class="p-4">
					<ViewPhoneNumbers
						phoneNumbers={data.myProfile.phoneNumbers}
						newPhoneNumberFormAction="/phoneNumbers?/addUserPhoneNumber"
						additionalFormData={{ userID: data.myProfile.id }}
					/>
				</div>
			</div>

			<div class="w-fit">
				<ViewAuditTrail object={data.myProfile} />
			</div>
		</div>
	</div>
{/if}
