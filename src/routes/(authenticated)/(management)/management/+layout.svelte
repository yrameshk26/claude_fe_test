<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	import { sidebarState } from '$sveltewind/components/layouts/Sidebar.svelte'

	import { UserGroupIcon, ShieldCheckIcon, ComputerIcon, TagIcon, ActivityIcon } from '$icons'

	const { data, children } = $props()

	$effect(() => {
		headerState.class = 'bg-gradient-to-r from-red-800 to-rose-800'
		sidebarState.class = 'bg-gradient-to-b from-red-800 to-rose-800'
		sidebarState.sidebarItems = [
			{
				id: '/management/staffs',
				title: 'Staffs',
				href: '/management/staffs',
				icon: UserGroupIcon,
				isVisibleCheck: () =>
					data.session.isAdmin ||
					!!data.session.permissions.find(
						(p) => p.app === 'MANAGEMENT' && p.permissionType === 'VIEW_STAFFS'
					)
			},
			{
				id: '/management/loginApprovals',
				title: 'Login Approvals',
				icon: ShieldCheckIcon,
				href: '/management/loginApprovals?status=ACTIVE',
				isVisibleCheck: () =>
					data.session.isAdmin ||
					!!data.session.permissions.find(
						(p) => p.app === 'MANAGEMENT' && p.permissionType === 'VIEW_LOGIN_APPROVALS'
					)
			},
			{
				id: '/management/sessions',
				title: 'Sessions',
				href: '/management/sessions',
				icon: ComputerIcon,
				isVisibleCheck: () =>
					data.session.isAdmin ||
					!!data.session.permissions.find(
						(p) => p.app === 'MANAGEMENT' && p.permissionType === 'VIEW_STAFF_SESSIONS'
					)
			},
			{
				id: '/management/activities',
				title: 'Staff Activities',
				href: '/management/activities?createdBy=me',
				icon: ActivityIcon
			},
			{
				id: '/management/settings/ticketSubjects',
				title: 'Ticket Subjects',
				href: '/management/settings/ticketSubjects',
				icon: TagIcon,
				isVisibleCheck: () =>
					data.session.isAdmin ||
					!!data.session.permissions.find(
						(p) => p.app === 'MANAGEMENT' && p.permissionType === 'VIEW_TICKET_SUBJECTS'
					)
			}
		]
	})
</script>

{@render children()}
