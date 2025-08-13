<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'Quick Reports'

	import {
		Table,
		TableHeadRow,
		TableHead,
		TableCellRow,
		TableCell,
		TableNoResultsRow
	} from '$sveltewind/components/table'

	import ErrorAlertWithReset from '$lib/components/ErrorAlertWithReset.svelte'

	import { ConfirmForm } from '$sveltewind/components/forms'
	import { GhostButton } from '$sveltewind/components/buttons'
	import { TrashIcon } from '$sveltewind/icons'

	let { data } = $props()
</script>

{#if data.errors}
	<ErrorAlertWithReset errors={data.errors} />
{:else}
	<Table classContainer="my-4 h-[calc(100%-248px)] lg:h-[calc(100%-98px)]">
		{#snippet tableHead()}
			<TableHeadRow>
				<TableHead class="min-w-44 text-xs uppercase">Name</TableHead>
				<TableHead class="min-w-0 text-xs uppercase">Link</TableHead>
				<TableHead class="min-w-44 text-xs uppercase">Created At</TableHead>
				<TableHead class="min-w-0 "></TableHead>
			</TableHeadRow>
		{/snippet}
		{#snippet tableRows()}
			{#each data.reports as report (report)}
				<TableCellRow>
					<TableCell class="text-sm">
						{report.key.replace('_', ' ')}
					</TableCell>
					<TableCell class="text-sm">
						<GhostButton href={report.value} class="p-2 text-xs">Open Report</GhostButton>
					</TableCell>
					<TableCell class="text-sm">{new Date(report.createdAt).toLocaleString()}</TableCell>

					<TableCell>
						<ConfirmForm
							label="Delete Quick Report"
							action="/reports?/deleteQuickReport"
							successMessage="Successfully deleted the quick report."
							additionalFormData={{ id: report.id }}
						>
							{#snippet trigger({ onclick })}
								<GhostButton
									{onclick}
									--color-ghostButton="var(--color-red-600)"
									class="p-2 text-xs"
								>
									<TrashIcon class="mr-1 size-4" />
									<span>Delete</span>
								</GhostButton>
							{/snippet}
							{#snippet fields()}
								<p class="text-sm">Are you sure you want to delete this quick report?</p>
							{/snippet}
						</ConfirmForm>
					</TableCell>
				</TableCellRow>
			{:else}
				<TableNoResultsRow />
			{/each}
		{/snippet}
	</Table>
{/if}
