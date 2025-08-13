<script lang="ts" module>
	type Props = {
		dailyReportLog: {
			id: string
			transactionNo?: string
			refundReceiptNo?: string
			receivingPaymentNo?: string
		}
	}
</script>

<script lang="ts">
	let { dailyReportLog }: Props = $props()

	import { TextBlock } from '$sveltewind/components/display'
</script>

{#if dailyReportLog}
	<TextBlock href={`/accounting/dailyReportLogs/${dailyReportLog.id}`}>
		{dailyReportLog.transactionNo ||
			dailyReportLog.refundReceiptNo ||
			dailyReportLog.receivingPaymentNo}
	</TextBlock>
{:else}
	-
{/if}
