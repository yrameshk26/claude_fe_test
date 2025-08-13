<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	import { Sidebar } from '$sveltewind/components/layouts'

	// Modern UI components
	import Card from '$lib/components/ui/card.svelte'
	import Button from '$lib/components/ui/button.svelte'
	import Badge from '$lib/components/ui/badge.svelte'
	import Alert from '$lib/components/ui/alert.svelte'
	import Table from '$lib/components/ui/table.svelte'
	import TableHeader from '$lib/components/ui/table-header.svelte'
	import TableBody from '$lib/components/ui/table-body.svelte'
	import TableRow from '$lib/components/ui/table-row.svelte'
	import TableHead from '$lib/components/ui/table-head.svelte'
	import TableCell from '$lib/components/ui/table-cell.svelte'

	// Legacy components still in use
	import { SolidButton, GhostButton } from '$sveltewind/components/buttons'
	import { NewForm, TextEditForm, ImageEditForm, ConfirmForm } from '$sveltewind/components/forms'
	import { PasswordInput } from '$sveltewind/components/inputs'

	// Icons and utilities
	import { TrashIcon, RefreshIcon } from '$sveltewind/icons'
	import { LogoutIcon } from '$icons'
	import { twMerge } from 'tailwind-merge'

	// App components
	import AppSwitcherMenu from '$lib/components/menu/AppSwitcherMenu.svelte'
	import ViewPhoneNumbers from '$lib/components/views/ViewPhoneNumbers.svelte'
	import ViewAuditTrail from '$lib/components/views/ViewAuditTrail.svelte'

	let { data } = $props()

	$effect(() => {
		headerState.title = 'Dashboard'
		headerState.class = 'bg-slate-900 border-b border-slate-800'
	})
</script>

<Sidebar class="w-64 bg-slate-900 text-white border-r border-slate-800">
	<div class="flex h-full flex-col">
		<div class="flex w-full flex-col items-center justify-between py-4">
			<div class="w-20 h-20 bg-slate-900/50 rounded-xl border border-slate-700 flex items-center justify-center mb-4">
				<span class="text-3xl font-bold text-slate-400">T</span>
			</div>
			<h1 class="w-full text-center text-xl font-semibold text-slate-200">
				TVUPWEB
			</h1>
		</div>
		<AppSwitcherMenu isInline />
		<div class="flex w-full flex-1 flex-col items-center justify-between py-4">
			<p></p>
			<div class="flex flex-col gap-2 text-center">
				<Badge variant="default" className="mx-auto">
					v{import.meta.env.BUILD_VERSION}
				</Badge>
				<p class="text-xs text-gray-400">
					Last Updated:
					<br />
					<span class="text-gray-300"
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
	<div class="bg-slate-950">
		
		<div class="relative p-6 space-y-6 overflow-y-auto" style="height: calc(100vh - 64px);">
			<!-- Welcome Section -->
			<div class="mb-6 animate-fade-in">
				<h1 class="text-3xl font-semibold text-white mb-2">
					Welcome back{data.myProfile?.fullName ? `, ${data.myProfile.fullName}` : ''}!
				</h1>
				<p class="text-slate-400">Manage your account settings and monitor your active sessions</p>
			</div>

			<!-- Stats Grid -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
				<Card variant="default" className="animate-fade-in">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm text-slate-400">Active Sessions</p>
							<p class="text-3xl font-bold text-white mt-1">{data.myProfile?.sessions?.length || 0}</p>
						</div>
						<div class="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
							<svg class="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
							</svg>
						</div>
					</div>
				</Card>

				<Card variant="default" className="animate-fade-in" style="animation-delay: 0.1s">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm text-slate-400">Profile Status</p>
							<p class="text-3xl font-bold text-white mt-1">Active</p>
						</div>
						<div class="w-12 h-12 bg-emerald-900/50 rounded-lg flex items-center justify-center">
							<svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
					</div>
				</Card>

				<Card variant="default" className="animate-fade-in" style="animation-delay: 0.2s">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm text-slate-400">Phone Numbers</p>
							<p class="text-3xl font-bold text-white mt-1">{data.myProfile?.phoneNumbers?.length || 0}</p>
						</div>
						<div class="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
							<svg class="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
							</svg>
						</div>
					</div>
				</Card>

				<Card variant="default" className="animate-fade-in" style="animation-delay: 0.3s">
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm text-slate-400">Security Level</p>
							<p class="text-3xl font-bold text-white mt-1">High</p>
						</div>
						<div class="w-12 h-12 bg-amber-900/50 rounded-lg flex items-center justify-center">
							<svg class="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
							</svg>
						</div>
					</div>
				</Card>
			</div>

			<!-- Active Sessions Card -->
			<Card variant="default" className="animate-fade-in" style="animation-delay: 0.4s">
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-xl font-semibold text-white flex items-center gap-3">
						<div class="w-9 h-9 bg-slate-700 rounded-lg flex items-center justify-center">
							<svg class="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
							</svg>
						</div>
						Active Sessions
					</h2>
					<Badge variant="default">{data.myProfile.sessions.length} Active</Badge>
				</div>
				<Table containerClassName="mb-6">
					<TableHeader>
						<TableRow>
							<TableHead>Logged In</TableHead>
							<TableHead>Expires At</TableHead>
							<TableHead>Location</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{#each data.myProfile.sessions as session (session.id)}
							<TableRow
								className={twMerge(
									data.myProfile.sessions.length > 1 &&
										session.fingerprint === data.session.cookies.TVUPWEB_FINGERPRINT &&
										'bg-primary/10 border-primary/30'
								)}
							>
								<TableCell>
									<div class="flex flex-col">
										<span class="text-white">
											{new Date(session.createdAt).toLocaleDateString('en-CA')}
										</span>
										<span class="text-xs text-gray-500">
											{new Date(session.createdAt).toLocaleTimeString('en-CA')}
										</span>
									</div>
								</TableCell>
								<TableCell>
									<div class="flex flex-col">
										<span class="text-white">
											{new Date(session.expiresAt).toLocaleDateString('en-CA')}
										</span>
										<span class="text-xs text-gray-500">
											{new Date(session.expiresAt).toLocaleTimeString('en-CA')}
										</span>
									</div>
								</TableCell>
								<TableCell>
									<div class="flex items-center gap-2">
										{#if session.city}
											<span class="text-white">{session.city}</span>
										{/if}
										{#if session.country}
											<Badge variant="default">{session.country}</Badge>
										{/if}
									</div>
								</TableCell>
								<TableCell className="text-right">
									{#if session.fingerprint === data.session.cookies.TVUPWEB_FINGERPRINT}
										<Badge variant="success">Current</Badge>
									{:else}
										<NewForm
											action="?/deleteMySession"
											successMessage="Successfully deleted session."
											label="Logout Session"
											additionalFormData={{
												id: session.id
											}}
										>
											{#snippet trigger({ onclick })}
												<Button
													{onclick}
													variant="outline"
													size="sm"
													className="border-red-500/30 text-red-400 hover:bg-red-500/10"
												>
													<LogoutIcon class="mr-1 h-3 w-3" />
													Revoke
												</Button>
											{/snippet}
											{#snippet fields()}
												<p class="text-sm">Are you sure you want to logout from this session?</p>
											{/snippet}
										</NewForm>
									{/if}
								</TableCell>
							</TableRow>
						{/each}
					</TableBody>
				</Table>
				<ConfirmForm
					label="Delete all sessions"
					action="?/deleteAllMySessions"
					successMessage="Successfully deleted all sessions."
				>
					{#snippet trigger({ onclick })}
						<button
							{onclick}
							class="w-fit px-3 py-2 text-xs font-medium text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg hover:bg-red-950/50 transition-all"
						>
							<TrashIcon class="mr-1 size-4 inline" />
							Delete all sessions</button
						>
					{/snippet}
					{#snippet fields()}
						<p class="text-sm">
							Are you sure you want to delete all sessions? You will also be logged out from the
							current session.
						</p>
					{/snippet}
				</ConfirmForm>
			</Card>

			<!-- My Profile Section -->
			<Card variant="default" className="animate-fade-in" style="animation-delay: 0.5s">
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-xl font-semibold text-white flex items-center gap-3">
						<div class="w-9 h-9 bg-slate-700 rounded-lg flex items-center justify-center">
							<svg class="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
							</svg>
						</div>
						My Profile
					</h2>
					{#if data.myProfile?.fullName}
						<Badge variant="success">Verified</Badge>
					{/if}
				</div>
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
									<button {onclick} class="px-4 py-2 text-xs font-medium text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg hover:bg-red-950/50 transition-all">
										<RefreshIcon class="mr-1 size-4 inline" /> Reset my password
									</button>
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
									<button
										{onclick}
										class="px-2 py-1 text-xs font-medium text-red-400 border border-red-900/50 rounded hover:bg-red-950/30 transition-all"
									>
										<TrashIcon class="mr-1 size-3 inline" />Remove
									</button>
								{/snippet}
							</ConfirmForm>
						{/if}
					</div>
				</div>
			</Card>

			<!-- My Phone Numbers Section -->
			<Card variant="default" className="@container animate-fade-in" style="animation-delay: 0.6s">
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-xl font-semibold text-white flex items-center gap-3">
						<div class="w-9 h-9 bg-slate-700 rounded-lg flex items-center justify-center">
							<svg class="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
							</svg>
						</div>
						My Phone Numbers
					</h2>
					<Badge variant="default">{data.myProfile.phoneNumbers?.length || 0} Numbers</Badge>
				</div>
				<div class="p-4">
					<ViewPhoneNumbers
						phoneNumbers={data.myProfile.phoneNumbers}
						newPhoneNumberFormAction="/phoneNumbers?/addUserPhoneNumber"
						additionalFormData={{ userID: data.myProfile.id }}
					/>
				</div>
			</Card>

			<!-- Audit Trail Section -->
			<Card variant="default" className="animate-fade-in" style="animation-delay: 0.7s">
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-xl font-semibold text-white flex items-center gap-3">
						<div class="w-9 h-9 bg-slate-700 rounded-lg flex items-center justify-center">
							<svg class="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
							</svg>
						</div>
						Audit Trail
					</h2>
					<Badge variant="default">Activity Log</Badge>
				</div>
				<ViewAuditTrail object={data.myProfile} />
			</Card>
		</div>
	</div>
{/if}
