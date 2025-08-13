<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	import { sidebarState } from '$sveltewind/components/layouts/Sidebar.svelte'

	import {
		DollarIcon,
		UserGroupIcon,
		ServerIcon,
		MoneyIcon,
		TicketIcon,
		GlobeIcon,
		LanguageIcon,
		TruckIcon,
		CubeIcon,
		UrlIcon,
		BoxStackIcon,
		ActivityIcon
	} from '$icons'

	const { data, children } = $props()

	$effect(() => {
		headerState.class = 'bg-slate-900 border-b border-slate-800'
		sidebarState.class = 'bg-slate-900 border-r border-slate-800'
		sidebarState.sidebarItems = [
			{
				id: '/billing/topups',
				title: 'Topups',
				href: '/billing/topups',
				icon: DollarIcon,
				notificationCount: data.counts?.todaysTopups,
				isVisibleCheck: () =>
					data.session.isAdmin ||
					!!data.session.permissions.find(
						(p) => p.app === 'BILLING' && p.permissionType === 'VIEW_TOPUPS'
					)
			},
			{
				id: '/billing/customers',
				title: 'Customers',
				href: '/billing/customers',
				icon: UserGroupIcon,
				isVisibleCheck: () =>
					data.session.isAdmin ||
					!!data.session.permissions.find(
						(p) => p.app === 'BILLING' && p.permissionType === 'VIEW_CUSTOMERS'
					)
			},
			{
				id: '/billing/services',
				title: 'Services',
				href: '/billing/services',
				icon: ServerIcon,
				isVisibleCheck: () =>
					data.session.isAdmin ||
					!!data.session.permissions.find(
						(p) => p.app === 'BILLING' && p.permissionType === 'VIEW_SERVICES'
					)
			},
			{
				id: '/billing/transactions',
				title: 'Transactions',
				href: '/billing/transactions',
				icon: MoneyIcon,
				isVisibleCheck: () =>
					data.session.isAdmin ||
					!!data.session.permissions.find(
						(p) => p.app === 'BILLING' && p.permissionType === 'VIEW_TRANSACTIONS'
					)
			},
			{
				id: '/billing/tickets',
				title: 'Tickets',
				href: '/billing/tickets?status=OPEN&assignedTo=me',
				icon: TicketIcon,
				notificationCount: data.counts?.customerTickets
			},
			{
				id: '/billing/sources',
				title: 'Sources',
				href: '/billing/sources',
				icon: GlobeIcon,
				isVisibleCheck: () =>
					data.session.isAdmin ||
					!!data.session.permissions.find(
						(p) => p.app === 'BILLING' && p.permissionType === 'VIEW_SOURCES'
					)
			},
			{
				id: '/billing/languages',
				title: 'Languages',
				href: '/billing/languages',
				icon: LanguageIcon,
				isVisibleCheck: () =>
					data.session.isAdmin ||
					!!data.session.permissions.find(
						(p) => p.app === 'BILLING' && p.permissionType === 'VIEW_LANGUAGES'
					)
			},
			{
				id: '/billing/shipments',
				title: 'Shipments',
				href: '/billing/shipments',
				icon: TruckIcon,
				isVisibleCheck: () =>
					data.session.isAdmin ||
					!!data.session.permissions.find(
						(p) => p.app === 'BILLING' && p.permissionType === 'VIEW_SHIPMENTS'
					)
			},
			{
				id: '/billing/serviceTypes',
				title: 'Service Types',
				href: '/billing/serviceTypes',
				icon: CubeIcon,
				isVisibleCheck: () =>
					data.session.isAdmin ||
					!!data.session.permissions.find(
						(p) => p.app === 'BILLING' && p.permissionType === 'VIEW_SERVICE_TYPES'
					)
			},
			{
				id: '/billing/serviceTypeURLs',
				title: 'Service Type URLs',
				href: '/billing/serviceTypeURLs',
				icon: UrlIcon,
				isVisibleCheck: () =>
					data.session.isAdmin ||
					!!data.session.permissions.find(
						(p) => p.app === 'BILLING' && p.permissionType === 'VIEW_SERVICE_TYPE_URLS'
					)
			},
			{
				id: '/billing/productTypes',
				title: 'Product Types',
				href: '/billing/productTypes',
				icon: BoxStackIcon,
				isVisibleCheck: () =>
					data.session.isAdmin ||
					!!data.session.permissions.find(
						(p) => p.app === 'BILLING' && p.permissionType === 'VIEW_PRODUCT_TYPES'
					)
			},
			{
				id: '/billing/activities',
				title: 'Staff Activities',
				href: '/billing/activities?createdBy=me',
				icon: ActivityIcon
			}
		]
	})
</script>

{@render children()}
