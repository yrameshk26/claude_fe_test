<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'View Todays Topups'

	import { Alert } from '$sveltewind/components/display'
	import { SolidButton, GhostButton } from '$sveltewind/components/buttons'
	import { SelectInput } from '$sveltewind/components/inputs'

	import { goto } from '$app/navigation'
	import { page } from '$app/state'

	type ServiceType = {
		id: string
		name: string
		color?: string // Optional property
	}

	let {
		data,
		children
	}: {
		data: {
			serviceTypes: ServiceType[]
			topupsCount: Record<string, number>
			errors?: string[]
		}
		children: import('svelte').Snippet
	} = $props()
</script>

<div class="flex h-full flex-col lg:flex-row">
	<div>
		{#if data.errors}
			{#each data.errors as error (error)}
				<Alert type="error">{error}</Alert>
			{/each}
		{:else}
			<div class="h-full lg:flex lg:shadow-2xl">
				<SelectInput
					name="serviceType"
					label="Select Service Type"
					classContainer="lg:hidden mb-2"
					value={page.params.serviceTypeID}
					options={data.serviceTypes.map((serviceType) => ({
						label: serviceType.name,
						value: serviceType.id
					}))}
					onSelect={(option) => {
						goto(`/billing/topups/${option.value}`)
					}}
				/>
				<div class="hidden flex-col overflow-y-auto px-1 lg:flex">
					{#each data.serviceTypes as serviceType (serviceType.id)}
						{#if page.params.serviceTypeID === serviceType.id}
							<SolidButton
								href={`/billing/topups/${serviceType.id}`}
								class="justify-between gap-1 text-xs"
							>
								{serviceType.name}
								<span
									class="inline-flex rounded-md bg-red-100 px-2 text-xs leading-5 font-semibold text-red-800 tabular-nums"
								>
									{data.topupsCount[serviceType.name] || 0}
								</span>
							</SolidButton>
						{:else}
							<GhostButton
								href={`/billing/topups/${serviceType.id}`}
								class="justify-between gap-1 text-xs"
							>
								<div class="flex items-center">
									<span
										style:background-color={serviceType.color}
										class="mr-1 inline-block h-3 w-3 rounded-full"
									>
									</span>
									<div>
										{serviceType.name}
									</div>
								</div>
								<span
									class="inline-flex rounded-md bg-red-100 px-2 text-xs leading-5 font-semibold text-red-800 tabular-nums"
								>
									{data.topupsCount[serviceType.name] || 0}
								</span>
							</GhostButton>
						{/if}
					{/each}
				</div>
			</div>
		{/if}
	</div>
	<div class="mx-auto flex w-full flex-1 flex-col overflow-hidden p-1">
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>
