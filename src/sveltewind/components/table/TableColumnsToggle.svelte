<script lang="ts" module>
	export const columnsState = $state({
		table: '',
		columns: {} as Record<string, string>,
		alwaysHiddenColumns: [] as string[],
		visibleColumns: [] as string[],
		set: (table: string, columns: Record<string, string>) => {
			columnsState.table = table
			columnsState.columns = columns
			const VISIBLE_COLUMNS = window.localStorage.getItem('VISIBLE_COLUMNS')
			let visibleColumns: string[] = []
			if (VISIBLE_COLUMNS) {
				visibleColumns = JSON.parse(VISIBLE_COLUMNS)[table] || Object.keys(columns)
			} else {
				visibleColumns = Object.keys(columns)
			}
			columnsState.visibleColumns = visibleColumns.filter(
				(c) => !columnsState.alwaysHiddenColumns.includes(c)
			)
		},
		toggleColumn: (column: string) => {
			let visibleColumns = [] as string[]
			if (columnsState.visibleColumns.includes(column)) {
				visibleColumns = columnsState.visibleColumns.filter((c) => c !== column)
			} else {
				visibleColumns = [...columnsState.visibleColumns, column]
			}
			columnsState.visibleColumns = visibleColumns.filter(
				(c) => !columnsState.alwaysHiddenColumns.includes(c)
			)
			const VISIBLE_COLUMNS = window.localStorage.getItem('VISIBLE_COLUMNS')
			if (VISIBLE_COLUMNS) {
				window.localStorage.setItem(
					'VISIBLE_COLUMNS',
					JSON.stringify({
						...JSON.parse(VISIBLE_COLUMNS),
						[columnsState.table]: columnsState.visibleColumns
					})
				)
			} else {
				window.localStorage.setItem(
					'VISIBLE_COLUMNS',
					JSON.stringify({ [columnsState.table]: columnsState.visibleColumns })
				)
			}
		}
	})
</script>

<script lang="ts">
	import { Dropdown } from '../display'
	import { GhostButton } from '../buttons'

	import { ColumnsIcon, EyeIcon, EyeSlashIcon } from '../../icons'

	const onToggleColumn = (column: string) => {
		// If there is only one column visible, don't hide it
		if (columnsState.visibleColumns.length === 1 && columnsState.visibleColumns.includes(column)) {
			return
		}
		columnsState.toggleColumn(column)
	}

	let columnsMenu = $derived(
		Object.entries(columnsState.columns).filter(
			([column]) => !columnsState.alwaysHiddenColumns.includes(column)
		)
	)
</script>

<Dropdown placement="bottom-right">
	{#snippet trigger({ open, close, isOpen })}
		<GhostButton class="relative p-1 text-gray-600" onclick={isOpen ? close : open}>
			<span class="sr-only">Open table columns toggle visibility</span>
			<ColumnsIcon />
			{#if Object.keys(columnsState.columns).filter((column) => !columnsState.alwaysHiddenColumns.includes(column)).length !== columnsState.visibleColumns.length}
				<div class="absolute top-0 right-0 -mt-1 -mr-1 flex">
					<span class="absolute inline-flex animate-ping">
						<span class="inline-flex size-3 rounded-full bg-orange-400 opacity-75"> </span>
					</span>
					<span class="relative inline-flex size-3 rounded-full bg-orange-500"> </span>
				</div>
			{/if}
		</GhostButton>
	{/snippet}
	<div class="flex min-w-[10rem] flex-col gap-1 p-1">
		{#each columnsMenu as [column, label] (column)}
			<GhostButton onclick={() => onToggleColumn(column)} class="justify-start text-xs">
				{#if columnsState.visibleColumns.includes(column)}
					<EyeIcon class="size-4" />
				{:else}
					<EyeSlashIcon class="size-4" />
				{/if}
				<span class="ml-2">
					{label}
				</span>
			</GhostButton>
		{/each}
	</div>
</Dropdown>
