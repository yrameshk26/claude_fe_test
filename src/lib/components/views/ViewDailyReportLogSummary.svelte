<script lang="ts" module>
	type Props = {
		data: any
		type?: 'SALES' | 'CREDIT_MEMO' | 'RECEIVING_PAYMENT'
	}
</script>

<script lang="ts">
	let { data, type }: Props = $props()

	import ErrorAlertWithReset from '$lib/components/ErrorAlertWithReset.svelte'
	import {
		Table,
		TableHeadRow,
		TableHead,
		TableCellRow,
		TableCell,
		TablePrint
	} from '$sveltewind/components/table'

	import { GhostButton } from '$sveltewind/components/buttons'
	import { DateInput } from '$sveltewind/components/inputs'

	import { twMerge } from 'tailwind-merge'
	import { goto } from '$app/navigation'

	$effect(() => {
		const currentURL = new URL(window.location.href)
		if (data.fromDate && data.toDate) {
			currentURL.searchParams.set('fromDate', `${data.fromDate}`)
			currentURL.searchParams.set('toDate', `${data.toDate}`)
		}
		goto(currentURL.href, { replaceState: true })
	})

	function handleCellClick(companyId: string, paymentId: string) {
		const currentURL = new URL(window.location.href)
		currentURL.pathname = '/accounting/dailyReportLogs'
		currentURL.searchParams.delete('fromDate')
		currentURL.searchParams.delete('toDate')
		let processedDateQuery = ''
		if (data.fromDate === data.toDate) {
			processedDateQuery = `processedDate_equals_${data.fromDate}`
		} else {
			processedDateQuery = `processedDate_gte_${data.fromDate}_&_processedDate_lte_${data.toDate}`
		}
		let q = `${processedDateQuery}`
		if (companyId && companyId !== 'null') {
			q = `${q}_&_company.id_equals_${companyId}`
		}
		if (paymentId && paymentId !== 'null') {
			q = `${q}_&_payments.paymentMethodID_equals_${paymentId}`
		}
		currentURL.searchParams.set('q', q)
		if (type) {
			currentURL.searchParams.set('type', type)
		}
		currentURL.searchParams.set('page', '1')
		goto(currentURL.href)
	}
</script>

<div class="grid grid-cols-2 justify-between gap-2 pb-2 lg:w-fit">
	<DateInput
		label="From Date"
		value={data.fromDate}
		onSelect={(date) => {
			const currentURL = new URL(window.location.href)
			currentURL.searchParams.set('fromDate', `${date}`)
			goto(currentURL.href, { replaceState: true })
		}}
		max={new Date(data.toDate + 'T00:00' || '')}
	/>
	<DateInput
		label="To Date"
		value={data.toDate}
		onSelect={(date) => {
			const currentURL = new URL(window.location.href)
			currentURL.searchParams.set('toDate', `${date}`)
			goto(currentURL.href, { replaceState: true })
		}}
		min={new Date(data.fromDate + 'T00:00' || '')}
		max={new Date()}
	/>
</div>

{#if data.errors}
	<ErrorAlertWithReset errors={data.errors} />
{:else}
	<Table classContainer="pb-4 h-[calc(100%-96px)]">
		{#snippet tableHead()}
			<TableHeadRow>
				<TableHead class="text-center">
					<TablePrint name={type + ' Summary'} />
				</TableHead>
				{#each data.headers || [] as header, idx (header.id)}
					<TableHead class="min-w-0">
						<GhostButton
							class={twMerge(idx !== 0 && 'text-center')}
							onclick={() => handleCellClick(header.id, 'null')}
						>
							{header.name}
						</GhostButton>
					</TableHead>
				{/each}
			</TableHeadRow>
		{/snippet}

		{#snippet tableRows()}
			{#each data.rows ?? [] as row, rowIdx (rowIdx)}
				<TableCellRow>
					{#each row as col, idx (idx)}
						<TableCell class={twMerge(idx !== 0 && 'text-center')}>
							<GhostButton
								class={twMerge(
									'py-1',
									idx === 0 && 'text-left font-bold',
									rowIdx === (data.rows?.length || 0) - 4 && 'py-1'
								)}
								onclick={() => {
									if (idx === 0) {
										handleCellClick('null', col.id)
									} else {
										handleCellClick(`${data.headers?.[idx - 1].id}`, row[0]?.id)
									}
								}}
							>
								{#if idx === 0}
									{col.name}
								{:else}
									{parseFloat(col).toFixed(2)}
								{/if}
							</GhostButton>
						</TableCell>
					{/each}
				</TableCellRow>
			{/each}
		{/snippet}
	</Table>
{/if}
