<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	import { sidebarState } from '$sveltewind/components/layouts/Sidebar.svelte'

	import {
		PhoneIcon,
		ActivityIcon,
		TagIcon,
		CategoryOneIcon,
		CategoryTwoIcon,
		CategoryThreeIcon
	} from '$icons'

	const { data, children } = $props()

	$effect(() => {
		headerState.class = 'bg-slate-900 border-b border-slate-800'
		sidebarState.class = 'bg-slate-900 border-r border-slate-800'
		sidebarState.sidebarItems = [
			{
				id: '/calltrack/activeCalls',
				title: 'Active Calls',
				href: '/calltrack/activeCalls',
				icon: PhoneIcon,
				isVisibleCheck: () =>
					data.session.isAdmin ||
					!!data.session.permissions.find(
						(p) => p.app === 'CALLTRACK' && p.permissionType === 'VIEW_ALL_CALL_RECORDS'
					)
			},
			{
				id: '/calltrack/callRecords',
				title: 'Call Records',
				href: '/calltrack/callRecords?createdBy=me',
				icon: PhoneIcon
			},
			{
				id: '/calltrack/callCategories',
				title: 'Call Categories',
				isVisibleCheck: () =>
					data.session.isAdmin ||
					!!data.session.permissions.find(
						(p) =>
							p.app === 'CALLTRACK' &&
							(p.permissionType === 'VIEW_CALL_CATEGORIES_LEVEL_ONE' ||
								p.permissionType === 'VIEW_CALL_CATEGORIES_LEVEL_TWO' ||
								p.permissionType === 'VIEW_CALL_CATEGORIES_LEVEL_THREE')
					),
				icon: TagIcon,
				subLinks: [
					{
						id: '/calltrack/callCategories/levelOne',
						title: 'Service Category',
						href: '/calltrack/callCategories/levelOne',
						icon: CategoryOneIcon,
						isVisibleCheck: () =>
							data.session.isAdmin ||
							!!data.session.permissions.find(
								(p) =>
									p.app === 'CALLTRACK' && p.permissionType === 'VIEW_CALL_CATEGORIES_LEVEL_ONE'
							)
					},
					{
						id: '/calltrack/callCategories/levelTwo',
						title: 'Main Category',
						href: '/calltrack/callCategories/levelTwo',
						icon: CategoryTwoIcon,
						isVisibleCheck: () =>
							data.session.isAdmin ||
							!!data.session.permissions.find(
								(p) =>
									p.app === 'CALLTRACK' && p.permissionType === 'VIEW_CALL_CATEGORIES_LEVEL_TWO'
							)
					},
					{
						id: '/calltrack/callCategories/levelThree',
						title: 'Sub Category',
						href: '/calltrack/callCategories/levelThree',
						icon: CategoryThreeIcon,
						isVisibleCheck: () =>
							data.session.isAdmin ||
							!!data.session.permissions.find(
								(p) =>
									p.app === 'CALLTRACK' && p.permissionType === 'VIEW_CALL_CATEGORIES_LEVEL_THREE'
							)
					}
				]
			},
			{
				id: '/calltrack/storePhoneNumbers',
				title: 'Store Phone Numbers',
				href: '/calltrack/storePhoneNumbers',
				icon: PhoneIcon,
				isVisibleCheck: () =>
					data.session.isAdmin ||
					!!data.session.permissions.find(
						(p) => p.app === 'CALLTRACK' && p.permissionType === 'VIEW_STORE_PHONE_NUMBERS'
					)
			},
			{
				id: '/calltrack/activities',
				title: 'Staff Activities',
				href: '/calltrack/activities?createdBy=me',
				icon: ActivityIcon
			}
		]
	})
</script>

{@render children()}
