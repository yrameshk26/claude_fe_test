<script lang="ts" module>
	type Props = {
		productID?: string
	}
</script>

<script lang="ts">
	import { NewForm } from '$sveltewind/components/forms'
	import { SolidButton, GhostButton } from '$sveltewind/components/buttons'
	import { DateInput, TextareaInput, SelectInput } from '$sveltewind/components/inputs'
	import { PlusIcon } from '$sveltewind/icons'

	let { productID }: Props = $props()

	import { page } from '$app/state'
</script>

<NewForm
	label="Create a new Warranty Claim"
	action="/wholesale/warrantyClaims/new"
	successMessage="Successfully created a new Warranty Claim."
>
	{#snippet trigger({ onclick })}
		{#if !productID}
			<SolidButton
				{onclick}
				class="text-xs"
				isDisabled={!(
					page.data.session.isAdmin ||
					page.data.session.permissions.find(
						(p) => p.app === 'WHOLESALE' && p.permissionType === 'ADD_WARRANTY_CLAIM'
					)
				)}
			>
				<PlusIcon class="mr-1 size-4" />
				New
			</SolidButton>
		{:else}
			<GhostButton {onclick} class="p-1" --color-ghostButton="var(--color-blue-700)">
				<PlusIcon class="size-4" />
				<span class="sr-only">New</span>
			</GhostButton>
		{/if}
	{/snippet}
	{#snippet fields()}
		<div class="flex flex-col gap-6">
			<DateInput isRequired name="returnedDate" label="Returned Date" value={new Date()} />

			<SelectInput
				isRequired
				isDisabled={!!productID}
				name="productID"
				label="Product"
				value={productID}
				loadMoreUrl="/_api/autocomplete/products"
			/>

			<TextareaInput name="notes" label="Notes" rows={4} />
		</div>
	{/snippet}
</NewForm>
