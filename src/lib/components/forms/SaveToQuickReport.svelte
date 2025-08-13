<script lang="ts">
	import { NewForm } from '$sveltewind/components/forms'
	import { SolidButton } from '$sveltewind/components/buttons'
	import { BookmarkIcon } from '$icons'
	import { TextInput } from '$sveltewind/components/inputs'

	import { page } from '$app/state'
</script>

{#if page.url.searchParams.has('groupBy') || page.url.searchParams.has('q')}
	<NewForm
		action="/reports?/saveToQuickReports"
		label="Add to Quick Reports"
		successMessage="Successfully added to Quick Reports."
		classForm="max-w-xl"
		additionalFormData={{
			value: page.url.toString()
		}}
	>
		{#snippet trigger({ onclick })}
			<SolidButton {onclick} class="text-xs">
				<BookmarkIcon class="mr-1 size-4" />
				<span>Add to Quick Reports</span>
			</SolidButton>
		{/snippet}
		{#snippet fields()}
			<TextInput isRequired name="name" label="Name" />
		{/snippet}
	</NewForm>
{/if}
