<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { tick, untrack } from 'svelte'

	import { dialogState } from '$sveltewind/components/display/Dialog.svelte'
	import { SolidButton, GhostButton } from '$sveltewind/components/buttons'
	import { Alert } from '$sveltewind/components/display'
	import { TextareaInput } from '$sveltewind/components/inputs'
	import { NewForm } from '$sveltewind/components/forms'

	import { MegaphoneIcon } from '$icons'

	import type { SubmitFunction } from '@sveltejs/kit'
	import { enhance } from '$app/forms'

	let latestAnnouncement = $derived(
		page.data.session.unreadAnnouncements[0]
	) as (typeof page.data.session.unreadAnnouncements)[0]

	$effect(() => {
		if (latestAnnouncement) {
			untrack(() => {
				dialogState.add(unreadAnnouncementDialogSnippet)
			})
		} else {
			untrack(() => {
				dialogState.close()
			})
		}
	})

	let formState = $state({
		isLoading: false,
		serverErrors: [] as string[]
	})
	const onDismiss: SubmitFunction = async ({ formData }) => {
		formState.isLoading = true
		formState.serverErrors = []
		formData.append('id', latestAnnouncement.id)
		return async ({ result, update }) => {
			formState.isLoading = false
			await update()
			if (result.type === 'failure') {
				formState.serverErrors = result.data?.errors
			} else if (result.type === 'success') {
				// stop the logout logoutTimer and restart the checkSessionInactivity inactivityInterval
				await tick()
				dialogState.close()
				await tick()
			} else if (result.type === 'redirect') {
				goto(result.location)
			}
		}
	}
</script>

{#snippet unreadAnnouncementDialogSnippet()}
	{#if latestAnnouncement}
		<div class="flex w-full max-w-3xl flex-col justify-center gap-8 rounded-md bg-white p-4 py-4">
			<div class="flex items-center gap-2 text-lg font-bold">
				<MegaphoneIcon class="size-8" />New Announcement
			</div>
			<span class="-mt-8 ml-10 text-sm"
				>{new Date(latestAnnouncement?.createdAt).toLocaleString('en-CA')}</span
			>

			<div class="p-2">
				{latestAnnouncement.message}
			</div>
			<div class="flex w-full justify-end gap-2">
				<form method="POST" action="/management?/dismissAnnouncement" use:enhance={onDismiss}>
					<SolidButton type="submit" isLoading={formState.isLoading}>Dismiss</SolidButton>
				</form>
			</div>
			{#if formState.serverErrors.length > 0}
				<Alert type="error" class="w-full">
					{#each formState.serverErrors as error (error)}
						{error}
					{/each}
				</Alert>
			{/if}
		</div>
	{/if}
{/snippet}

{#if page.data.session.isAdmin || page.data.session.permissions.find(({ permissionType }: { permissionType: string }) => permissionType === 'SEND_ANNOUNCEMENT')}
	<NewForm
		label="Send Announcement"
		action="/management?/sendNewAnnouncement"
		successMessage="Successfully sent the announcement."
	>
		{#snippet trigger({ onclick })}
			<GhostButton
				{onclick}
				class="p-1 text-xs text-white hover:bg-gray-800/50 focus-visible:bg-gray-700 lg:px-4 lg:py-3"
			>
				<div class="relative">
					<MegaphoneIcon class="lg:mr-1" />
				</div>
				<span class="sr-only lg:not-sr-only">New Announcement</span>
			</GhostButton>
		{/snippet}
		{#snippet fields()}
			<div class="flex flex-col gap-6">
				<Alert type="info" class="w-full">Send an announcement to all users.</Alert>

				<TextareaInput label="Message" name="message" isRequired rows={4} />
			</div>
		{/snippet}
	</NewForm>
{/if}
