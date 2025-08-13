<script>
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'

	import { page } from '$app/state'
	import { Tabs } from '$sveltewind/components/display'

	let { data, children } = $props()

	$effect(() => {
		headerState.title = 'Staff ' + data.user?.fullName
	})
</script>

<Tabs
	links={[
		{ label: 'General', href: `/management/staffs/${page.params.id}` },
		{ label: 'Permissions', href: `/management/staffs/${page.params.id}/permissions` },
		{ label: 'Login Approvals', href: `/management/staffs/${page.params.id}/loginApprovals` },
		{ label: 'Tickets', href: `/management/staffs/${page.params.id}/tickets?status=OPEN` }
	]}
/>

<div class="h-[calc(100%-56px)] overflow-auto">
	{@render children()}
</div>
