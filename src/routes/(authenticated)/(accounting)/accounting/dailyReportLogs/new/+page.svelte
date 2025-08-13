<script lang="ts" module>
	import type { SubmitFunction } from '@sveltejs/kit'
</script>

<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'New Daily Report Log'

	import { Tabs } from '$sveltewind/components/display'

	import { enhance } from '$app/forms'
	import { goto } from '$app/navigation'

	import { SolidButton, GhostButton } from '$sveltewind/components/buttons'
	import {
		DateInput,
		TextInput,
		TextareaInput,
		SelectInput,
		ToggleInput
	} from '$sveltewind/components/inputs'
	import { Alert } from '$sveltewind/components/display'
	import {
		Table,
		TableHeadRow,
		TableHead,
		TableCellRow,
		TableCell
	} from '$sveltewind/components/table'
	import { MinusIcon, PlusIcon } from '$sveltewind/icons'

	import UserSelectInput from '$lib/components/UserSelectInput.svelte'
	import { twMerge } from 'tailwind-merge'
	import { maskitoNumberOptionsGenerator } from '@maskito/kit'

	let formState = $state({
		isLoading: false,
		serverErrors: [] as string[]
	})
	let transactionType = $state('SALES')
	let payments = $state([
		{
			paymentMethod: {
				id: '',
				name: '',
				isCard: false
			},
			terminalID: '',
			authorizationCode: '',
			details: '',
			amount: ''
		}
	])
	const onSubmit: SubmitFunction = async ({ formData }) => {
		formState.isLoading = true
		formState.serverErrors = []
		// remove undefined values from formData
		for (const [key, value] of [...formData.entries()]) {
			if (value === undefined || value === '' || value === null) {
				formData.delete(key)
			}
		}
		// append payments to formData
		formData.append('payments', JSON.stringify(payments))
		return async ({ result, update }) => {
			await update()
			formState.isLoading = false
			if (result.type === 'failure') {
				formState.serverErrors = result.data?.errors
			} else if (result.type === 'success') {
				const newDailyReportLogID = result.data
				goto(`/accounting/dailyReportLogs/${newDailyReportLogID}`)
			} else if (result.type === 'redirect') {
				goto(result.location)
			}
		}
	}
</script>

<Tabs />

<form
	method="POST"
	use:enhance={onSubmit}
	class="grid h-[calc(100%-56px)] gap-4 overflow-auto p-2 lg:grid-cols-7 lg:gap-8"
>
	<div class="p-2 lg:col-span-5">
		<div class="grid gap-4 lg:grid-cols-3 lg:gap-8">
			<div class="flex flex-col gap-4 lg:col-span-3 lg:gap-8">
				<div class="flex flex-col gap-4">
					<h2 class="font-semibold">Transaction</h2>
					<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
						<SelectInput
							isRequired
							name="transactionType"
							bind:value={transactionType}
							label="Transaction Type"
							loadMoreUrl="/_api/autocomplete/accountingTransactionTypes"
							onSelect={(option) => {
								if (option.value === 'CREDIT_MEMO') {
									// make all payment amounts negative
									payments = payments.map((payment) => ({
										...payment,
										amount:
											payment.amount !== '' && parseInt(payment.amount) > 0
												? `-${payment.amount}`
												: payment.amount
									}))
								}
							}}
							classInput="text-lg"
						/>
						<TextInput
							name="transactionNo"
							label="Transaction No."
							isRequired={transactionType === 'SALES'}
							isDisabled={transactionType === 'RECEIVING_PAYMENT'}
						/>
						<TextInput
							name="receivingPaymentNo"
							label="Receiving Payment No."
							isRequired={transactionType === 'RECEIVING_PAYMENT'}
							isDisabled={transactionType !== 'RECEIVING_PAYMENT'}
						/>
						<TextInput
							name="refundReceiptNo"
							label="Refund Receipt No."
							isDisabled={transactionType === 'SALES' || transactionType === 'RECEIVING_PAYMENT'}
						/>
					</div>
				</div>

				<div class="flex flex-col gap-4">
					<h2 class="font-semibold">Payments</h2>
					<div class="grid grid-cols-1 gap-2">
						{#if transactionType === 'CREDIT_MEMO'}
							<Alert type="error" class="w-full font-semibold">
								This is a credit memo. All amounts must be negative.
							</Alert>
						{/if}
						<Table classContainer="h-full">
							{#snippet tableHead()}
								<TableHeadRow>
									<TableHead class="min-w-0"></TableHead>
									<TableHead class="min-w-24">Type</TableHead>
									<TableHead class="min-w-20">Terminal</TableHead>
									<TableHead class="min-w-20">Auth Code</TableHead>
									<TableHead class="min-w-20">Details/Last 4 Digits</TableHead>
									<TableHead class="min-w-0">Amount</TableHead>
								</TableHeadRow>
							{/snippet}

							{#snippet tableRows()}
								{#each payments as payment, idx (idx)}
									<TableCellRow class="h-14 hover:bg-gray-50/50">
										<TableCell>
											<GhostButton
												isDisabled={idx === 0}
												hideDisabledIcon
												onclick={() => {
													payments.splice(idx, 1)
												}}
												--color-ghostButton="var(--color-red-600)"
												class={twMerge(
													'p-1.5 text-xs',
													idx === 0 && 'pointer-events-none opacity-0'
												)}
											>
												<MinusIcon class="size-4" />
												<span class="sr-only">Delete</span>
											</GhostButton>
										</TableCell>
										<TableCell>
											<SelectInput
												isRequired
												bind:value={payment.paymentMethod.id}
												loadMoreUrl="/_api/autocomplete/paymentMethods"
												onSelect={(option) => {
													payments[idx].paymentMethod = {
														id: option.value as string,
														name: option.label,
														isCard: option.metadata?.isCard
													}
													payments[idx].terminalID = ''
												}}
											/>
										</TableCell>
										<TableCell>
											<SelectInput
												isDisabled={!payments[idx].paymentMethod.id ||
													!payments[idx].paymentMethod.isCard}
												hideDisabledIcon
												isRequired={payments[idx].paymentMethod.isCard}
												bind:value={payments[idx].terminalID}
												loadMoreUrl="/_api/autocomplete/terminals"
												classContainer={twMerge(
													(!payments[idx].paymentMethod.id ||
														!payments[idx].paymentMethod.isCard) &&
														'py-2'
												)}
											/>
										</TableCell>
										<TableCell>
											<TextInput
												isDisabled={!payments[idx].paymentMethod.id}
												hideDisabledIcon
												bind:value={payments[idx].authorizationCode}
												classContainer="py-1"
												classInput="w-24"
											/>
										</TableCell>
										<TableCell>
											<TextInput
												isDisabled={!payments[idx].paymentMethod.id}
												hideDisabledIcon
												bind:value={payments[idx].details}
												classContainer="py-1"
												placeholder={payments[idx].paymentMethod.isCard ? '4 digit code' : ''}
												maskitoOptions={{
													mask: payments[idx].paymentMethod.isCard
														? [/\d/, /\d/, /\d/, /\d/]
														: /\w+/
												}}
											/>
										</TableCell>
										<TableCell>
											<TextInput
												isDisabled={!payments[idx].paymentMethod.id}
												hideDisabledIcon
												isRequired={idx === 0 || !!payments[idx].paymentMethod.id}
												bind:value={payments[idx].amount}
												classContainer={twMerge(
													'py-1 w-fit tabular-nums break-keep font-medium',
													parseInt(payments[idx].amount as string) < 0 && 'bg-red-50 text-red-700',
													parseInt(payments[idx].amount as string) > 0 &&
														'bg-green-50 text-green-700',
													parseInt(payments[idx].amount as string) == 0 &&
														'bg-gray-100 text-gray-700'
												)}
												classInput="text-right w-20"
												maskitoOptions={maskitoNumberOptionsGenerator({
													decimalZeroPadding: true,
													thousandSeparator: '',
													precision: 2,
													decimalSeparator: '.',
													minusSign: '-',
													max: transactionType === 'CREDIT_MEMO' ? 0 : 999999999999999.0
												})}
											/>
										</TableCell>
									</TableCellRow>
								{/each}
								<TableCellRow class="">
									<TableCell colspan={7}>
										<GhostButton
											onclick={() => {
												payments.push({
													paymentMethod: { id: '', name: '', isCard: false },
													terminalID: '',
													authorizationCode: '',
													details: '',
													amount: ''
												})
											}}
											class="text-xs"
											--color-ghostButton="var(--color-blue-600)"
										>
											<PlusIcon class="mr-1" />Add New
										</GhostButton>
									</TableCell>
								</TableCellRow>
							{/snippet}
						</Table>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="flex flex-col gap-4 p-2 lg:col-span-2">
		<h2 class="font-semibold">Info</h2>
		<div class="flex flex-col gap-6 pb-8">
			<DateInput isRequired name="processedDate" label="Processed Date" />
			<SelectInput
				isRequired
				name="companyID"
				label="Company"
				loadMoreUrl="/_api/autocomplete/companies"
			/>
			<TextareaInput name="notes" label="Add a note" />

			<ToggleInput name="needVerification" label="Needs Verification" />

			<UserSelectInput isRequired name="salesPersonID" label="Sales Person" />
		</div>
		{#each formState.serverErrors as error (error)}
			<Alert type="error">{error}</Alert>
		{/each}

		<SolidButton type="submit" isLoading={formState.isLoading}>Submit</SolidButton>
	</div>
</form>
