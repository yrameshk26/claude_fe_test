<script lang="ts" module>
	type Props = {
		searchQuery: string
		newNoteFormAction: string
		notes?: NoteType[]
	}

	type NoteType = {
		id: number
		createdAt: string
		updatedAt: string
		details: string
		markAsDone: boolean
		callRecordID: number
		user: {
			id: string
			fullName: string
			imageUrl: string
		}
	}
</script>

<script lang="ts">
	import { SolidButton, GhostButton } from '$sveltewind/components/buttons'
	import { TextareaInput } from '$sveltewind/components/inputs'
	import { Alert, TextBlock } from '$sveltewind/components/display'
	import { LoadingIcon } from '$sveltewind/icons'

	import { TextareaEditForm, NewForm, ConfirmForm } from '$sveltewind/components/forms'
	import { PlusIcon, TrashIcon } from '$sveltewind/icons'
	import { PhoneIcon } from '$icons'
	import { page } from '$app/state'
	import UserAvatar from '../UserAvatar.svelte'

	let { searchQuery, newNoteFormAction, notes: propsNotes }: Props = $props()

	let notes = $state([]) as NoteType[]
	let isLoading = $state(false)
	let error = $state(null) as string | null

	const loadNotes = () => {
		isLoading = true
		error = null
		fetch(`/_api/getNotes${searchQuery}`)
			.then((res) => res.json())
			.then((data) => {
				if (data.errors) {
					error = data.errors
				} else {
					if (propsNotes && propsNotes.length > 0) {
						notes = [...data, ...propsNotes]
							.filter((note, index, self) => self.findIndex((n) => n.id === note.id) === index)
							.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
					} else {
						notes = data
					}
				}
			})
			.catch((err) => (error = err.message))
			.finally(() => (isLoading = false))
	}

	$effect(() => {
		loadNotes()
	})
</script>

<div id="notes" class="w-full bg-yellow-50 p-2 pb-3">
	<div class="flex items-center justify-between p-2">
		<h2 class="text-center text-lg font-semibold">Notes</h2>

		<NewForm
			label="Add a new note"
			action={newNoteFormAction}
			successMessage="Successfully added a new note."
			additionalFormData={{ id: page.params.id }}
			onSuccess={loadNotes}
		>
			{#snippet trigger({ onclick })}
				<SolidButton {onclick} class="py-1 text-xs">
					<PlusIcon />
					Add
				</SolidButton>
			{/snippet}

			{#snippet fields()}
				<div class="flex flex-col gap-6">
					<TextareaInput isRequired name="details" label="Details" rows={4} />
				</div>
			{/snippet}
		</NewForm>
	</div>

	<div class="flex max-h-96 flex-col items-center gap-2 overflow-y-auto rounded-lg">
		{#if isLoading}
			<div class="flex h-full items-center justify-center gap-2 text-yellow-600">
				<LoadingIcon /> Loading Notes
			</div>
		{:else if error}
			<Alert type="error" class="w-full items-center justify-between"
				>{error}
				<GhostButton onclick={loadNotes} --color-ghostButton="var(--color-red-500)">
					Reload
				</GhostButton>
			</Alert>
		{:else}
			{#each notes as note (note.id)}
				<div class="flex w-full flex-col bg-yellow-100 px-4 py-2 shadow-sm">
					<div class="flex w-full justify-between">
						<div class="flex items-center gap-2 text-xs">
							<UserAvatar
								class="size-5"
								fullName={note.user.fullName}
								imageUrl={note.user.imageUrl}
							/>
							<TextBlock href={`/management/staffs/${note.user.id}`}>{note.user.fullName}</TextBlock
							>
						</div>
						<div>
							{#if propsNotes && propsNotes.length > 0 && notes.find((n) => n.id === note.id)?.callRecordID}
								<GhostButton
									href={`/calltrack/callRecords/${notes.find((n) => n.id === note.id)?.callRecordID}`}
									--color-ghostButton="var(--color-blue-500)"
								>
									<PhoneIcon class="mr-2 size-4" />
									From Call Record
								</GhostButton>
							{/if}
							<ConfirmForm
								label="Delete Note"
								action={`/notes/${note.id}?/deleteNote`}
								successMessage="Successfully deleted the note."
								onSuccess={loadNotes}
							>
								{#snippet trigger({ onclick })}
									<GhostButton {onclick} --color-ghostButton="var(--color-red-500)" class="p-2">
										<TrashIcon class="size-4" />
										<span class="sr-only">Delete Note</span>
									</GhostButton>
								{/snippet}
								{#snippet fields()}
									<p class="text-sm">Are you sure you want to delete this note?</p>
								{/snippet}
							</ConfirmForm>
						</div>
					</div>

					<div class="mb-2 text-xs text-gray-500">
						{new Date(note.updatedAt).toLocaleString('en-CA', {
							year: 'numeric',
							month: '2-digit',
							day: '2-digit',
							hour: '2-digit',
							minute: '2-digit',
							second: '2-digit',
							hour12: false
						})}
					</div>

					{#if new Date(note.updatedAt).getTime() < new Date().getTime() - 300000}
						<TextBlock class="text-xs font-semibold">{note.details}</TextBlock>
					{:else if note.user.id === page.data.session?.id}
						<TextareaEditForm
							name="details"
							value={note.details}
							action={`/notes/${note.id}?/updateNoteDetails`}
							successMessage="Successfully updated the note."
							onSuccess={loadNotes}
							classContainer="ring-0 bg-white"
							classInputGroup="py-1"
						/>
					{:else}
						<TextBlock class="text-xs font-semibold">{note.details}</TextBlock>
					{/if}
				</div>
			{:else}
				<div class="text-xs pt-2">No notes found</div>
			{/each}
		{/if}
	</div>
</div>
