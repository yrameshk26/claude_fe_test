<script lang="ts">
	import { SolidButton, GhostButton } from '$sveltewind/components/buttons'
	import { Dropdown } from '$sveltewind/components/display'

	import { ChevronDownIcon, ArrowsRightLeftIcon } from '$sveltewind/icons'
	import { ServerIcon } from '$icons'

	import { page } from '$app/state'
</script>

{#if page.data.session.isAdmin || page.data.session.permissions.find( ({ permissionType }: { permissionType: string }) => ['MERGE_CUSTOMERS', 'SEPARATE_CUSTOMERS'].includes(permissionType) )}
	<Dropdown placement="bottom-left" class="min-w-[14rem]">
		{#snippet trigger({ open, close, isOpen })}
			<SolidButton onclick={isOpen ? close : open} class="p-2">
				<ChevronDownIcon class="size-5" />
				<span class="sr-only">Open New Customer Menu</span>
			</SolidButton>
		{/snippet}
		<div class="flex flex-col gap-1 p-1">
			{#if page.data.session.isAdmin || page.data.session.permissions.find(({ permissionType }: { permissionType: string }) => permissionType === 'MERGE_CUSTOMERS')}
				<GhostButton
					href="/billing/customers/merge"
					class="justify-start text-sm"
					--color-ghostButton="var(--color-blue-600)"
				>
					<ArrowsRightLeftIcon class="mr-2 size-4" />
					Merge Customers
				</GhostButton>
			{/if}
			{#if page.data.session.isAdmin || page.data.session.permissions.find(({ permissionType }: { permissionType: string }) => permissionType === 'SEPARATE_CUSTOMERS')}
				<GhostButton
					href="/billing/customers/createFromService"
					class="justify-start text-sm"
					--color-ghostButton="var(--color-blue-600)"
				>
					<ServerIcon class="mr-2 size-4" />
					Create from Service
				</GhostButton>
			{/if}
		</div>
	</Dropdown>
{/if}
