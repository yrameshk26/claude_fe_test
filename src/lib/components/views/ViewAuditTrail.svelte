<script lang="ts" module>
	type Props = {
		object?: Record<string, any>
	}
</script>

<script lang="ts">
	import { TextBlock } from '$sveltewind/components/display'
	import UserLink from '$lib/components/links/UserLink.svelte'

	let { object = {} }: Props = $props()

	const fields = {
		createdAt: {
			label: 'Created At',
			type: 'date'
		},
		createdByUser: {
			label: 'Created By',
			type: 'user'
		},
		updatedAt: {
			label: 'Updated At',
			type: 'date'
		},
		updatedByUser: {
			label: 'Updated By',
			type: 'user'
		},
		handledByUser: {
			label: 'Handled By',
			type: 'user'
		},
		lastTopupAt: {
			label: 'Last Topup At',
			type: 'date'
		},
		lockedByUser: {
			label: 'Locked By',
			type: 'user'
		},
		requestedAt: {
			label: 'Requested At',
			type: 'date'
		},
		requestedUser: {
			label: 'Requested By',
			type: 'user'
		},
		approvedAt: {
			label: 'Approved At',
			type: 'date'
		},
		processedAdmin: {
			label: 'Processed By',
			type: 'user'
		},
		lastLoginDate: {
			label: 'Last Login Date',
			type: 'date'
		},
		expiresAt: {
			label: 'Expires At',
			type: 'date'
		},
		assignedToUser: {
			label: 'Assigned To',
			type: 'user'
		},
		assignedByUser: {
			label: 'Assigned By',
			type: 'user'
		},
		salesPerson: {
			label: 'Sales Person',
			type: 'user'
		}
	}

	let filteredFieldValues = $derived(
		Object.entries(object)
			.filter(([key]) => fields[key as keyof typeof fields])
			.filter(([, value]) => !!value)
	)
</script>

<div class="w-full bg-gray-100 p-2 pb-4">
	<h2 class="p-2 text-lg font-semibold">Audit</h2>
	<div class="flex w-full flex-col rounded-sm text-xs">
		{#each filteredFieldValues as [key, value] (key)}
			{@const field = fields[key as keyof typeof fields]}
			<div
				class="grid w-full grid-cols-3 items-center gap-2 border-b border-b-slate-200 bg-slate-50 p-1 py-2 hover:bg-white"
			>
				<div class="pl-1 text-left">
					{field.label}:
				</div>
				<div class="col-span-2 flex-nowrap overflow-x-auto">
					{#if field.type === 'date'}
						<TextBlock class="w-full justify-end text-right text-xs">
							{new Date(value).toLocaleString('en-CA', {
								year: 'numeric',
								month: '2-digit',
								day: '2-digit',
								hour: '2-digit',
								minute: '2-digit',
								second: '2-digit',
								hour12: false
							})}
						</TextBlock>
					{:else if field.type === 'user'}
						<div class="flex justify-end pr-6 text-right">
							<UserLink user={value} />
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>
