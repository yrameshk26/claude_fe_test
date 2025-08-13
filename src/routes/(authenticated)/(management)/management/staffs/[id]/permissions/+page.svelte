<script lang="ts">
	import { ConfirmForm, ToggleEditForm } from '$sveltewind/components/forms'
	import { Alert } from '$sveltewind/components/display'
	import { GhostButton } from '$sveltewind/components/buttons'
	import { CheckIcon, XMarkIcon } from '$sveltewind/icons'
	import { TextInput } from '$sveltewind/components/inputs'
	import { dialogState } from '$sveltewind/components/display/Dialog.svelte'

	import { twMerge } from 'tailwind-merge'

	let activeSearch = $state('')

	let {
		data
	}: {
		data: {
			user: { id: string; isAdmin: boolean }
			session: { isAdmin: boolean }
			permissions: Record<string, Array<{ permissionType: string }>>
			fieldEditPermissions: Record<string, Record<string, Array<string>>>
			allPermissionTypes: [string, { display: string; permissions: Record<string, string[]> }][]
			errors?: Array<string>
		}
	} = $props()
</script>

{#snippet editDialogSnippet({ app, model })}
	<div class="flex w-full max-w-md flex-col gap-4 overflow-auto rounded-md bg-white p-6">
		<div class="flex items-center justify-between gap-2">
			<h2 class="text-base leading-6 font-semibold text-gray-900 uppercase">
				EDIT {model} PERMISSIONS
			</h2>
			<ToggleEditForm
				name="enable"
				value={Object.values(data.fieldEditPermissions[app][model]).every((permission) =>
					data.permissions[app]?.find(
						({ permissionType }: { permissionType: string }) => permissionType === permission
					)
				)}
				action={`/management/staffs/${data.user.id}/permissions?/toggleUserPermissionGroup`}
				additionalFormData={{ app, model: model, action: 'EDIT' }}
				successMessage="Successfully updated permission group."
				classForm="ring-0 w-fit"
				onSuccess={() => dialogState.close()}
			/>
		</div>
		<div class="mt-4">
			{#each data.fieldEditPermissions[app][model] as permission (permission)}
				{@const hasPermission = data.permissions[app]?.find(
					({ permissionType }: { permissionType: string }) => permissionType === permission
				)}
				<ConfirmForm
					label="Toggle Permission"
					action={`/management/staffs/${data.user.id}/permissions?/toggleUserPermission`}
					additionalFormData={{ app, permissionType: permission }}
					successMessage="Successfully updated permission."
					autoSubmit
				>
					{#snippet trigger({ onclick })}
						<GhostButton
							{onclick}
							class={twMerge(
								'my-0.5 w-full justify-start px-2 text-xs',
								hasPermission && 'bg-green-100 text-green-600 hover:bg-green-200',
								!hasPermission && 'bg-red-100 text-red-600 hover:bg-red-200'
							)}
						>
							{#if data.permissions[app]?.find(({ permissionType }: { permissionType: string }) => permissionType === permission)}
								<CheckIcon class="mr-1" />
							{:else}
								<XMarkIcon class="mr-1" />
							{/if}
							{permission.replaceAll('_', ' ')}
						</GhostButton>
					{/snippet}
				</ConfirmForm>
			{/each}
			{#if data.fieldEditPermissions[app][model].length === 0}
				<Alert type="info">No permissions available for this model.</Alert>
			{/if}
		</div>
	</div>
{/snippet}

{#if data.errors}
	{#each data.errors as error (error)}
		<Alert type="error">{error}</Alert>
	{/each}
{:else if data.user.isAdmin}
	<Alert type="warning">This staff is an admin. They have full access to all features.</Alert>
{:else if data.allPermissionTypes}
	<TextInput
		bind:value={activeSearch}
		placeholder="Filter permissions..."
		classContainer="m-4"
		classInput="text-xs"
	/>
	<div class="h-[calc(100%-72px)] overflow-y-auto">
		<div class="grid gap-4 overflow-auto p-4 lg:grid-cols-5">
			{#each data.allPermissionTypes as [app, { display, permissions }] (app)}
				<div>
					<div class="flex items-center justify-between gap-2">
						<h2 class="text-base leading-6 font-semibold text-gray-900 uppercase">
							{display}
						</h2>
						{#if data.session.isAdmin}
							<ToggleEditForm
								name="enable"
								value={Object.values(permissions).every((permissionTypes) =>
									permissionTypes.every((permission) =>
										data.permissions[app]?.find(
											({ permissionType }: { permissionType: string }) =>
												permissionType === permission
										)
									)
								)}
								action={`/management/staffs/${data.user.id}/permissions?/toggleUserPermissionGroup`}
								additionalFormData={{ app }}
								successMessage="Successfully updated all permissions."
								classForm="ring-0 w-fit"
							/>
						{/if}
					</div>
					<div class="mt-4">
						{#each Object.entries(permissions) as [permissionCategory, permissionTypes] (permissionCategory)}
							<div class="pb-4">
								<div class="flex items-center justify-between gap-2">
									<h3
										class="py-2 text-xs leading-4 font-bold tracking-wider text-blue-800 uppercase"
									>
										{permissionCategory}
									</h3>
									{#if permissionCategory !== 'EDIT' && data.session.isAdmin}
										<ToggleEditForm
											name="enable"
											value={permissionTypes.every((permission) =>
												data.permissions[app]?.find(
													({ permissionType }: { permissionType: string }) =>
														permissionType === permission
												)
											)}
											action={`/management/staffs/${data.user.id}/permissions?/toggleUserPermissionGroup`}
											additionalFormData={{ app, action: permissionCategory }}
											successMessage="Successfully updated all permissions."
											classForm="ring-0 w-fit"
										/>
									{/if}
								</div>
								{#each permissionTypes.filter((permissionType) => permissionType
										.toLowerCase()
										.includes(activeSearch.toLowerCase())) as permission (permission)}
									{@const hasPermission = data.permissions[app]?.find(
										({ permissionType }: { permissionType: string }) =>
											permissionType === permission
									)}
									{@const model = permission.slice(5)}
									{@const hasAllEditPermissions = data.fieldEditPermissions[app][model]?.every(
										(fieldLevelPermission) =>
											data.permissions[app]?.find(
												({ permissionType }: { permissionType: string }) =>
													permissionType === fieldLevelPermission
											)
									)}
									{@const hasSomeEditPermissions = data.fieldEditPermissions[app][model]?.some(
										(fieldLevelPermission) =>
											data.permissions[app]?.find(
												({ permissionType }: { permissionType: string }) =>
													permissionType === fieldLevelPermission
											)
									)}
									{#if permission.startsWith('EDIT_')}
										<GhostButton
											onclick={() =>
												dialogState.add(editDialogSnippet, {
													closeOnOverlay: true,
													closeOnEscape: true,
													snippetProps: { app, model }
												})}
											class={twMerge(
												'my-0.5 w-full justify-start px-2 text-xs',
												hasAllEditPermissions && 'bg-green-100 text-green-600 hover:bg-green-200',
												!hasAllEditPermissions && 'bg-red-100 text-red-600 hover:bg-red-200',
												hasSomeEditPermissions &&
													!hasAllEditPermissions &&
													'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
											)}
										>
											{#if hasAllEditPermissions || hasSomeEditPermissions}
												<CheckIcon class="mr-1" />
											{:else}
												<XMarkIcon class="mr-1" />
											{/if}
											{permission.replaceAll('_', ' ')}
										</GhostButton>
									{:else}
										<ConfirmForm
											label="Toggle Permission"
											action={`/management/staffs/${data.user.id}/permissions?/toggleUserPermission`}
											additionalFormData={{ app, permissionType: permission }}
											successMessage="Successfully updated permission."
											autoSubmit
										>
											{#snippet trigger({ onclick })}
												<GhostButton
													{onclick}
													class={twMerge(
														'my-0.5 w-full justify-start px-2 text-xs',
														hasPermission && 'bg-green-100 text-green-600 hover:bg-green-200',
														!hasPermission && 'bg-red-100 text-red-600 hover:bg-red-200'
													)}
												>
													{#if hasPermission}
														<CheckIcon class="mr-1" />
													{:else}
														<XMarkIcon class="mr-1" />
													{/if}
													{permission.replaceAll('_', ' ')}
												</GhostButton>
											{/snippet}
										</ConfirmForm>
									{/if}
								{/each}
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}
