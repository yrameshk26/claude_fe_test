<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	import { sidebarState } from '$sveltewind/components/layouts/Sidebar.svelte'

	import {
		BoxStackIcon,
		QRCodeIcon,
		AddProductIcon,
		SellProductIcon,
		WarrantyIcon,
		UserGroupIcon,
		UserIcon,
		ActivityIcon
	} from '$icons'

	const { data, children } = $props()

	$effect(() => {
		headerState.class = 'bg-gradient-to-r from-green-800 to-teal-800'
		sidebarState.class = 'bg-gradient-to-b from-green-800 to-teal-800'
		sidebarState.sidebarItems = [
			{
				id: '/wholesale/products',
				title: 'Products',
				icon: BoxStackIcon,
				isVisibleCheck: () =>
					data.session.isAdmin ||
					!!data.session.permissions.find(
						(p) => p.app === 'WHOLESALE' && p.permissionType === 'VIEW_PRODUCTS'
					),
				href: '/wholesale/products'
			},
			{
				id: '/wholesale/warrantyClaims',
				title: 'Warranty Claims',
				href: '/wholesale/warrantyClaims',
				icon: WarrantyIcon,
				isVisibleCheck: () =>
					data.session.isAdmin ||
					!!data.session.permissions.find(
						(p) => p.app === 'WHOLESALE' && p.permissionType === 'VIEW_WARRANTY_CLAIMS'
					)
			},
			{
				id: '/wholesale/scanner',
				title: 'Scanner',
				icon: QRCodeIcon,
				isVisibleCheck: () =>
					data.session.isAdmin ||
					!!data.session.permissions.find(
						(p) => p.app === 'WHOLESALE' && p.permissionType === 'ADD_PRODUCT'
					),
				subLinks: [
					{
						id: '/wholesale/scanner/addProducts',
						title: 'Add Products',
						href: '/wholesale/scanner/addProducts',
						icon: AddProductIcon,
						isVisibleCheck: () =>
							data.session.isAdmin ||
							!!data.session.permissions.find(
								(p) => p.app === 'WHOLESALE' && p.permissionType === 'ADD_PRODUCT'
							)
					},
					{
						id: '/wholesale/scanner/sellProducts',
						title: 'Sell Products',
						href: '/wholesale/scanner/sellProducts',
						icon: SellProductIcon,
						isVisibleCheck: () =>
							data.session.isAdmin ||
							!!data.session.permissions.find(
								(p) => p.app === 'WHOLESALE' && p.permissionType === 'ADD_PRODUCT'
							)
					}
				]
			},

			{
				id: '/wholesale/resellers',
				title: 'Resellers',
				href: '/wholesale/resellers',
				icon: UserGroupIcon,
				isVisibleCheck: () =>
					data.session.isAdmin ||
					!!data.session.permissions.find(
						(p) => p.app === 'WHOLESALE' && p.permissionType === 'VIEW_RESELLERS'
					)
			},
			{
				id: '/wholesale/vendors',
				title: 'Vendors',
				href: '/wholesale/vendors',
				icon: UserIcon,
				isVisibleCheck: () =>
					data.session.isAdmin ||
					!!data.session.permissions.find(
						(p) => p.app === 'WHOLESALE' && p.permissionType === 'VIEW_VENDORS'
					)
			},
			{
				id: '/wholesale/activities',
				title: 'Staff Activities',
				href: '/wholesale/activities?createdBy=me',
				icon: ActivityIcon
			}
		]
	})
</script>

{@render children()}
