<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'New Customer From Service'

	import NewCustomerForm from '$lib/components/forms/NewCustomerForm.svelte'
	import { Alert } from '$sveltewind/components/display'
	import { SelectInput } from '$sveltewind/components/inputs'
	import { Tabs } from '$sveltewind/components/display'

	import { page } from '$app/state'
</script>

<Tabs />

<NewCustomerForm>
	<div class="flex flex-col gap-2 px-4 pb-2">
		<Alert type="warning">
			Creating a new customer from an existing service will unlink the service from the previous
			customer and link it to the new customer.
		</Alert>
		<SelectInput
			isRequired
			name="serviceID"
			label="Service"
			loadMoreUrl="/_api/autocomplete/services"
			value={page.url.searchParams.get('serviceID') || ''}
		/>
	</div>
</NewCustomerForm>
