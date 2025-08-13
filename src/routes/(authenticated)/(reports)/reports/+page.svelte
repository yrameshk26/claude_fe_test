<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'Reports Dashboard'

	import ErrorAlertWithReset from '$lib/components/ErrorAlertWithReset.svelte'
	import { twMerge } from 'tailwind-merge'

	let {
		data
	}: {
		data: {
			errors: string[]
			counts: Record<string, Record<string, number>>
		}
	} = $props()

	const apps = [
		{ app: 'Billing', cardClass: 'bg-cyan-100', countClass: 'border-b-cyan-200 bg-cyan-50' },
		{
			app: 'Accounting',
			cardClass: 'bg-orange-100',
			countClass: 'border-b-orange-200 bg-orange-50'
		},
		{ app: 'Wholesale', cardClass: 'bg-green-100', countClass: 'border-b-green-200 bg-green-50' },
		{
			app: 'CallTrack',
			cardClass: 'bg-violet-100',
			countClass: 'border-b-violet-200 bg-violet-50'
		},
		{ app: 'Management', cardClass: 'bg-red-100', countClass: 'border-b-red-200 bg-red-50' }
	]

	const formatDuration = (seconds: number) => {
		const hours = Math.floor(seconds / 3600)
		const minutes = Math.floor((seconds % 3600) / 60)
		const remainingSeconds = seconds % 60
		return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(remainingSeconds).padStart(2, '0')}s`
	}
</script>

<div class="h-[calc(100%)] overflow-auto pb-4">
	{#if data.errors}
		<ErrorAlertWithReset errors={data.errors} />
	{:else}
		<div class=" columns-1 gap-8 sm:columns-2 md:columns-3 lg:columns-4">
			{#each apps as { app, cardClass, countClass } (app)}
				{#each Object.entries(data.counts[app]) as [label, counts] (label)}
					<div
						class={twMerge(
							'mb-6 flex break-inside-avoid-column flex-col gap-2 rounded-md p-4 shadow-md',
							cardClass
						)}
					>
						<div class="flex items-center justify-between gap-2 px-2">
							<h2 class="text-lg font-semibold">
								{label.replaceAll(/(?<!^)(?=[A-Z])/g, ' ')}
							</h2>
						</div>
						<div class="flex flex-col rounded-sm p-2 text-sm">
							{#each Object.entries(counts || {}) as [stat, count] (stat)}
								<div
									class={twMerge(
										'grid grid-cols-2 items-center gap-2 border-b p-2 hover:bg-white',
										countClass
									)}
								>
									<div class="pl-1 text-left">
										{stat}:
									</div>
									<div class="flex-nowrap overflow-x-auto text-right font-semibold">
										{#if label.includes('Duration')}
											{formatDuration(count)}
										{:else}
											{Intl.NumberFormat('en-CA').format(count)}
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			{/each}
		</div>
	{/if}
</div>
