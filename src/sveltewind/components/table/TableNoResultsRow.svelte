<script lang="ts">
	import { Alert } from '../display'
	import TableCellRow from './TableCellRow.svelte'
	import TableCell from './TableCell.svelte'
</script>

<TableCellRow class="hover:bg-white">
	<TableCell colspan={25} class="py-1">
		<Alert type="error" class="">
			<div class="flex w-full items-center justify-between gap-4 py-0">
				<div class="text-left">No results found.</div>
			</div>
		</Alert>
	</TableCell>
</TableCellRow>
