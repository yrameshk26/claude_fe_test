<script lang="ts">
	import { GhostButton } from '$sveltewind/components/buttons'
	import { Dropdown } from '$sveltewind/components/display'

	import { page } from '$app/state'
	import { twMerge } from 'tailwind-merge'

	import { MoneyIcon, TableIcon, BuildingIcon, PhoneIcon, ShieldCheckIcon, ChartIcon } from '$icons'

	let { isInline = false }: { isInline?: boolean } = $props()

	// console.log(page.data.session.permissions.filter(({ app }: { app: string }) => app === 'MANAGEMENT').map(({ permissionType }: { permissionType: string }) => permissionType))

	const appItems = {
		billing: {
			name: 'Billing',
			href: '/billing',
			icon: MoneyIcon,
			isVisibleCheck: () =>
				page.data.session.isAdmin ||
				page.data.session.permissions.find(({ app }: { app: string }) => app === 'BILLING'),
			colors: 'bg-slate-800 hover:bg-slate-700 border border-slate-700'
		},
		accounting: {
			name: 'Accounting',
			href: '/accounting',
			icon: TableIcon,
			isVisibleCheck: () =>
				page.data.session.isAdmin ||
				page.data.session.permissions.find(({ app }: { app: string }) => app === 'ACCOUNTING'),
			colors: 'bg-slate-800 hover:bg-slate-700 border border-slate-700'
		},

		wholesale: {
			name: 'Wholesale',
			href: '/wholesale',
			icon: BuildingIcon,
			isVisibleCheck: () =>
				page.data.session.isAdmin ||
				page.data.session.permissions.find(({ app }: { app: string }) => app === 'WHOLESALE'),
			colors: 'bg-slate-800 hover:bg-slate-700 border border-slate-700'
		},
		calltrack: {
			name: 'Call Track',
			href: '/calltrack',
			icon: PhoneIcon,
			isVisibleCheck: () =>
				page.data.session.isAdmin ||
				page.data.session.permissions.find(({ app }: { app: string }) => app === 'CALLTRACK'),
			colors: 'bg-slate-800 hover:bg-slate-700 border border-slate-700'
		},
		management: {
			name: 'Management',
			href: '/management',
			icon: ShieldCheckIcon,
			isVisibleCheck: () =>
				page.data.session.isAdmin ||
				page.data.session.permissions.find(({ app }: { app: string }) => app === 'MANAGEMENT'),
			colors: 'bg-slate-800 hover:bg-slate-700 border border-slate-700'
		},
		reports: {
			name: 'Reports',
			href: '/reports',
			icon: ChartIcon,
			isVisibleCheck: () =>
				page.data.session.isAdmin ||
				page.data.session.permissions.find(
					({ permissionType }: { permissionType: string }) => permissionType === 'VIEW_REPORTS'
				),
			colors: 'bg-slate-800 hover:bg-slate-700 border border-slate-700'
		}
	}

	let activeApp = $derived(
		Object.values(appItems).find((app) => page.url.pathname.startsWith(app.href))
	)
</script>

{#snippet content()}
	<div class="flex w-full flex-col items-center gap-2 p-1">
		<div class="flex w-full flex-col items-center">
			<img src="/logo.png" class="size-32" alt="TVUPWEB Logo" />
			<p class="mb-2 text-center text-sm">Select an application</p>
		</div>

		{#each Object.values(appItems) as app (app)}
			{#if !app.isVisibleCheck || app.isVisibleCheck()}
				<GhostButton
					href={app.href}
					class={twMerge(
						'w-full max-w-xs justify-start px-8 py-4 text-white uppercase',
						app.colors
					)}
				>
					<app.icon class="mr-3 size-5"></app.icon>
					{app.name}
				</GhostButton>
			{/if}
		{/each}
	</div>
{/snippet}

{#if isInline}
	{@render content()}
{:else if activeApp}
	<Dropdown placement="bottom-center" class="mt-2 ml-4 min-w-[12rem]">
		{#snippet trigger({ open, close, isOpen })}
			<GhostButton
				class="flex w-[10.5rem] flex-col px-0 py-3 text-center text-lg text-white hover:bg-gray-500/50 focus-visible:bg-gray-700"
				onclick={isOpen ? close : open}
			>
				<activeApp.icon class="size-10"></activeApp.icon>
				<span class="text-xl uppercase">
					{activeApp.name}
				</span>
			</GhostButton>
		{/snippet}

		{@render content()}
	</Dropdown>
{/if}
