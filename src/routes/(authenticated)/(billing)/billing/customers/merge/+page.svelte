<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'Merge Customers'

	import NewCustomerForm from '$lib/components/forms/NewCustomerForm.svelte'
	import { Alert } from '$sveltewind/components/display'
	import { MultiSelectInput } from '$sveltewind/components/inputs'
	import { Tabs } from '$sveltewind/components/display'
</script>

<Tabs />

<NewCustomerForm>
	<div class="flex flex-col gap-2 px-4 pb-2">
		<Alert type="warning">
			Merging customers will combine all the data from the selected customers into a single
			customer. This action is irreversible.
		</Alert>
		<MultiSelectInput
			isRequired
			name="customerIDs"
			label="Customers to Merge"
			loadMoreUrl="/_api/autocomplete/customers"
		/>
	</div>
</NewCustomerForm>
