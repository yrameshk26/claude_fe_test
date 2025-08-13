<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	import { sidebarState } from '$sveltewind/components/layouts/Sidebar.svelte'

	import {
		TableIcon,
		SellIcon,
		RefundIcon,
		ReceivingPaymentIcon,
		NewspaperIcon,
		BuildingIcon,
		MoneyIcon,
		TerminalIcon,
		TicketIcon,
		ActivityIcon
	} from '$icons'

	const { data, children } = $props()

	$effect(() => {
		headerState.class = 'bg-slate-900 border-b border-slate-800'
		sidebarState.class = 'bg-slate-900 border-r border-slate-800'
		sidebarState.sidebarItems = [
			{
				id: '/accounting/summary',
				title: 'Summary',
				icon: TableIcon,
				isVisibleCheck: () =>
					data.session.isAdmin ||
					!!data.session.permissions.find(
						(p) => p.app === 'ACCOUNTING' && p.permissionType === 'VIEW_ACCOUNTING_DASHBOARD'
					),
				subLinks: [
					{
						id: '/accounting/summary/sales',
						title: 'Sales',
						href: '/accounting/summary/sales',
						icon: SellIcon,
						isVisibleCheck: () =>
							data.session.isAdmin ||
							!!data.session.permissions.find(
								(p) => p.app === 'ACCOUNTING' && p.permissionType === 'VIEW_ACCOUNTING_DASHBOARD'
							)
					},
					{
						id: '/accounting/summary/refund',
						title: 'Refund',
						href: '/accounting/summary/refund',
						icon: RefundIcon,
						isVisibleCheck: () =>
							data.session.isAdmin ||
							!!data.session.permissions.find(
								(p) => p.app === 'ACCOUNTING' && p.permissionType === 'VIEW_ACCOUNTING_DASHBOARD'
							)
					},
					{
						id: '/accounting/summary/receivingPayment',
						title: 'Receiving Payment',
						href: '/accounting/summary/receivingPayment',
						icon: ReceivingPaymentIcon,
						isVisibleCheck: () =>
							data.session.isAdmin ||
							!!data.session.permissions.find(
								(p) => p.app === 'ACCOUNTING' && p.permissionType === 'VIEW_ACCOUNTING_DASHBOARD'
							)
					},
					{
						id: '/accounting/summary/total',
						title: 'Total',
						href: '/accounting/summary/total',
						icon: MoneyIcon,
						isVisibleCheck: () =>
							data.session.isAdmin ||
							!!data.session.permissions.find(
								(p) => p.app === 'ACCOUNTING' && p.permissionType === 'VIEW_ACCOUNTING_DASHBOARD'
							)
					}
				]
			},
			{
				id: '/accounting/dailyReportLogs',
				title: 'Daily Report Logs',
				href: '/accounting/dailyReportLogs',
				icon: NewspaperIcon,
				isVisibleCheck: () =>
					data.session.isAdmin ||
					!!data.session.permissions.find(
						(p) => p.app === 'ACCOUNTING' && p.permissionType === 'VIEW_DAILY_REPORT_LOGS'
					)
			},
			{
				id: '/accounting/tickets',
				title: 'Tickets',
				href: '/accounting/tickets?status=OPEN&assignedTo=me',
				icon: TicketIcon,
				notificationCount: data.counts?.dailyReportLogTickets
			},
			{
				id: '/accounting/companies',
				title: 'Companies',
				href: '/accounting/companies',
				icon: BuildingIcon,
				isVisibleCheck: () =>
					data.session.isAdmin ||
					!!data.session.permissions.find(
						(p) => p.app === 'ACCOUNTING' && p.permissionType === 'VIEW_COMPANIES'
					)
			},
			{
				id: '/accounting/paymentMethods',
				title: 'Payment Methods',
				href: '/accounting/paymentMethods',
				icon: MoneyIcon,
				isVisibleCheck: () =>
					data.session.isAdmin ||
					!!data.session.permissions.find(
						(p) => p.app === 'ACCOUNTING' && p.permissionType === 'VIEW_PAYMENT_METHODS'
					)
			},
			{
				id: '/accounting/terminals',
				title: 'Terminals',
				href: '/accounting/terminals',
				icon: TerminalIcon,
				isVisibleCheck: () =>
					data.session.isAdmin ||
					!!data.session.permissions.find(
						(p) => p.app === 'ACCOUNTING' && p.permissionType === 'VIEW_TERMINALS'
					)
			},
			{
				id: '/accounting/activities',
				title: 'Staff Activities',
				href: '/accounting/activities?createdBy=me',
				icon: ActivityIcon
			}
		]
	})
</script>

{@render children()}
