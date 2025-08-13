<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'New Customer'

	import NewCustomerForm from '$lib/components/forms/NewCustomerForm.svelte'

	import { Tabs } from '$sveltewind/components/display'
</script>

<Tabs />

<NewCustomerForm />
