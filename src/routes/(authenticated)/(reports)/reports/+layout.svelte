<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	import { sidebarState } from '$sveltewind/components/layouts/Sidebar.svelte'

	import {
		DashboardIcon,
		MoneyIcon,
		DollarIcon,
		ServerIcon,
		TableIcon,
		BoxStackIcon,
		WarrantyIcon,
		PhoneIcon,
		ActivityIcon
	} from '$icons'

	const { children } = $props()

	$effect(() => {
		headerState.class = 'bg-slate-900 border-b border-slate-800'
		sidebarState.class = 'bg-slate-900 border-r border-slate-800'
		sidebarState.sidebarItems = [
			{
				id: '/reports/dashboard',
				title: 'Dashboard',
				href: '/reports',
				icon: DashboardIcon
			},
			{
				id: '/reports/quickReports',
				title: 'Quick Reports',
				href: '/reports/quickReports',
				icon: DashboardIcon
			},
			{
				id: '/reports/activities',
				title: 'Staff Activities',
				href: '/reports/activities',
				icon: ActivityIcon
			},
			{
				id: '/reports/billing',
				title: 'Billing',
				icon: DollarIcon,
				subLinks: [
					{
						id: '/reports/billing/topups',
						title: 'Remaining Topups',
						href: '/reports/billing/topups',
						icon: MoneyIcon
					},
					{
						id: '/reports/billing/customers',
						title: 'Customers',
						href: '/reports/billing/customers',
						icon: MoneyIcon
					},
					{
						id: '/reports/billing/services',
						title: 'Services',
						href: '/reports/billing/services',
						icon: ServerIcon
					}
				]
			},
			{
				id: '/reports/accounting',
				title: 'Accounting',
				icon: TableIcon,
				subLinks: [
					{
						id: '/reports/accounting/dailyReportLogs',
						title: 'Daily Report Logs',
						href: '/reports/accounting/dailyReportLogs',
						icon: TableIcon
					},
					{
						id: '/reports/accounting/payments',
						title: 'Payments',
						href: '/reports/accounting/payments',
						icon: MoneyIcon
					}
				]
			},
			{
				id: '/reports/wholesale',
				title: 'Wholesale',
				icon: DollarIcon,
				subLinks: [
					{
						id: '/reports/wholesale/products',
						title: 'Products',
						href: '/reports/wholesale/products',
						icon: BoxStackIcon
					},
					{
						id: '/reports/wholesale/warrantyClaims',
						title: 'Warranty Claims',
						href: '/reports/wholesale/warrantyClaims',
						icon: WarrantyIcon
					}
				]
			},
			{
				id: '/reports/calltrack',
				title: 'Call Track',
				icon: PhoneIcon,
				subLinks: [
					{
						id: '/reports/calltrack/callRecords',
						title: 'Call Records',
						href: '/reports/calltrack/callRecords',
						icon: PhoneIcon
					}
				]
			}
			// {
			// 	id: '/reports/management',
			// 	title: 'Management',
			// 	icon: ShieldCheckIcon,
			// 	subLinks: [
			// 		{
			// 			id: '/reports/management/staffs',
			// 			title: 'Staffs',
			// 			href: '/reports/management/staffs',
			// 			icon: PhoneIcon
			// 		}
			// 	]
			// }
		]
	})
</script>

{@render children()}
