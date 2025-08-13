<script>
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'

	import { page } from '$app/state'
	import { Tabs } from '$sveltewind/components/display'

	let { data, children } = $props()

	$effect(() => {
		headerState.title = 'Customer ' + data.customer?.fullName
	})
</script>

<Tabs
	links={[
		{ label: 'General', href: `/billing/customers/${page.params.id}` },
		{ label: 'Services', href: `/billing/customers/${page.params.id}/services` },
		{ label: 'Transactions', href: `/billing/customers/${page.params.id}/transactions` },
		{ label: 'Tickets', href: `/billing/customers/${page.params.id}/tickets?status=OPEN` }
	]}
/>

<div class="h-[calc(100%-56px)] overflow-auto">
	{@render children()}
</div>
