<script lang="ts">
	import ViewNotes from '$lib/components/views/ViewNotes.svelte'
	import ViewAuditTrail from '$lib/components/views/ViewAuditTrail.svelte'

	import { Alert, TextBlock } from '$sveltewind/components/display'
	import {
		DateEditForm,
		TextEditForm,
		SelectEditForm,
		ToggleEditForm,
		ConfirmForm,
		NewForm
	} from '$sveltewind/components/forms'
	import { SolidButton, GhostButton } from '$sveltewind/components/buttons'
	import { TrashIcon, MinusIcon, PlusIcon, CheckIcon } from '$sveltewind/icons'
	import {
		Table,
		TableHeadRow,
		TableHead,
		TableCellRow,
		TableCell
	} from '$sveltewind/components/table'
	import { SelectInput, TextInput } from '$sveltewind/components/inputs'

	import { maskitoNumberOptionsGenerator } from '@maskito/kit'

	import { page } from '$app/state'
	import { twMerge } from 'tailwind-merge'

	import UserLink from '$lib/components/links/UserLink.svelte'

	let { data } = $props()

	let newPayment = $state({
		paymentMethod: {
			id: '',
			name: '',
			isCard: false
		},
		terminalID: '',
		authorizationCode: '',
		details: '',
		amount: ''
	})
</script>

{#snippet amountSnippet({ amount }: { amount: number })}
	<div
		class={twMerge(
			'flex items-center justify-end rounded-md px-2 py-1.5 font-bold break-keep tabular-nums',
			amount > 0 && 'bg-green-50 text-green-700',
			amount < 0 && 'bg-red-50 text-red-700',
			amount == 0 && 'bg-gray-100 text-gray-700'
		)}
	>
		<TextBlock>
			{Intl.NumberFormat('en', {
				style: 'currency',
				currency: 'USD',
				currencyDisplay: 'symbol'
			}).format(amount)}
		</TextBlock>
	</div>
{/snippet}

{#if data.errors}
	{#each data.errors as error (error)}
		<Alert type="error">{error}</Alert>
	{/each}
{:else}
	<div class="grid gap-4 lg:grid-cols-7 lg:gap-8">
		<div class="p-2 lg:col-span-5">
			<div class="flex flex-col gap-4 lg:col-span-3 lg:gap-8">
				<div class="flex flex-col gap-4">
					<h2 class="font-semibold">Basic Info</h2>
					<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
						<DateEditForm
							isRequired
							name="processedDate"
							label="Processed Date"
							value={data.dailyReportLog.processedDate}
							action={`/accounting/dailyReportLogs/${data.dailyReportLog.id}?/updateDailyReportLogProcessedDate`}
							successMessage="Successfully updated joined date."
						/>
						<SelectEditForm
							name="companyID"
							label="Company"
							value={data.dailyReportLog.company?.id}
							loadMoreUrl="/_api/autocomplete/companies"
							action={`/accounting/dailyReportLogs/${data.dailyReportLog.id}?/updateDailyReportLogCompany`}
							successMessage="Successfully updated company."
						>
							{#snippet valueSnippet()}
								{data.dailyReportLog.company?.name || '-'}
							{/snippet}
						</SelectEditForm>
						<ToggleEditForm
							name="needVerification"
							label="Needs Verification"
							value={data.dailyReportLog.needVerification}
							action={`/accounting/dailyReportLogs/${data.dailyReportLog.id}?/updateDailyReportLogNeedVerification`}
							successMessage="Successfully updated is from call."
						/>
					</div>
				</div>
				<div class="flex flex-col gap-4">
					<h2 class="font-semibold">Transaction</h2>
					<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
						<SelectEditForm
							isDisabled={!(
								data.session.isAdmin ||
								data.session.permissions.find(
									(p) =>
										p.app === 'ACCOUNTING' &&
										p.permissionType === 'EDIT_DAILY_REPORT_LOG_TRANSACTION_TYPE'
								)
							)}
							name="transactionType"
							label="Transaction Type"
							value={data.dailyReportLog.transactionType}
							loadMoreUrl="/_api/autocomplete/accountingTransactionTypes"
							action={`/accounting/dailyReportLogs/${data.dailyReportLog.id}?/updateDailyReportLogTransactionType`}
							successMessage="Successfully updated transaction type."
						>
							{#snippet valueSnippet()}
								{data.dailyReportLog.transactionType?.replaceAll('_', ' ') || '-'}
							{/snippet}
						</SelectEditForm>
						<TextEditForm
							name="transactionNo"
							label="Transaction No"
							value={data.dailyReportLog.transactionNo}
							action={`/accounting/dailyReportLogs/${data.dailyReportLog.id}?/updateDailyReportLogTransactionNo`}
							successMessage="Successfully updated transaction no."
						/>
						<TextEditForm
							name="refundReceiptNo"
							label="Refund Receipt No"
							value={data.dailyReportLog.refundReceiptNo}
							action={`/accounting/dailyReportLogs/${data.dailyReportLog.id}?/updateDailyReportLogRefundReceiptNo`}
							successMessage="Successfully updated refund receipt no."
						/>
						<TextEditForm
							name="receivingPaymentNo"
							label="Receiving Payment No"
							value={data.dailyReportLog.receivingPaymentNo}
							action={`/accounting/dailyReportLogs/${data.dailyReportLog.id}?/updateDailyReportLogReceivingPaymentNo`}
							successMessage="Successfully updated receiving payment no."
						/>
					</div>
				</div>
				<div class="flex flex-col gap-4">
					<h2 class="font-semibold">Payments</h2>
					<div class="grid grid-cols-1 gap-2">
						{#if data.dailyReportLog.transactionType === 'CREDIT_MEMO'}
							<Alert type="error" class="w-full font-semibold">
								This is a credit memo. All amounts must be negative.
							</Alert>
						{/if}
						<Table classContainer="h-full">
							{#snippet tableHead()}
								<TableHeadRow>
									<TableHead class="min-w-0"></TableHead>
									<TableHead class="min-w-40">Type</TableHead>
									<TableHead class="min-w-40">Terminal</TableHead>
									<TableHead class="min-w-40">Auth Code</TableHead>
									<TableHead class="min-w-40">Details/Last 4 Digits</TableHead>
									<TableHead class="min-w-40 pr-8 text-right">Amount</TableHead>
								</TableHeadRow>
							{/snippet}

							{#snippet tableRows()}
								{#each data.dailyReportLog.payments as payment (payment.id)}
									<TableCellRow class="hover:bg-gray-50/50">
										<TableCell>
											<ConfirmForm
												label="Delete Payment"
												action={`/accounting/dailyReportLogs/${data.dailyReportLog.id}?/deletePayment`}
												additionalFormData={{ paymentID: payment.id }}
												successMessage="Successfully deleted the payment."
											>
												{#snippet fields()}
													<p class="text-sm">Are you sure you want to delete this payment?</p>
												{/snippet}
												{#snippet trigger({ onclick })}
													<GhostButton
														isDisabled={!(
															data.session.isAdmin ||
															data.session.permissions.find(
																(p) =>
																	p.app === 'ACCOUNTING' && p.permissionType === 'DELETE_PAYMENT'
															)
														)}
														{onclick}
														--color-ghostButton="var(--color-red-600)"
														class="p-1.5 text-xs"
													>
														<MinusIcon class="size-4" />
														<span class="sr-only">Delete</span>
													</GhostButton>
												{/snippet}
											</ConfirmForm>
										</TableCell>
										<TableCell>
											<SelectEditForm
												name="paymentMethodID"
												value={payment.paymentMethod.id}
												isDisabled={!(
													data.session.isAdmin ||
													data.session.permissions.find(
														(p) =>
															p.app === 'ACCOUNTING' &&
															p.permissionType === 'EDIT_PAYMENT_PAYMENT_METHOD'
													)
												)}
												loadMoreUrl="/_api/autocomplete/paymentMethods"
												action={`/accounting/dailyReportLogs/${data.dailyReportLog.id}?/updatePaymentMethod`}
												successMessage="Successfully updated payment method."
												additionalFormData={{ paymentID: payment.id }}
												classValue="text-xs"
												classInput="text-xs"
											>
												{#snippet valueSnippet()}
													{payment.paymentMethod.name || '-'}
												{/snippet}
											</SelectEditForm>
										</TableCell>
										<TableCell>
											<SelectEditForm
												name="terminalID"
												value={payment.terminalID}
												isDisabled={!(
													data.session.isAdmin ||
													data.session.permissions.find(
														(p) =>
															p.app === 'ACCOUNTING' && p.permissionType === 'EDIT_PAYMENT_TERMINAL'
													)
												)}
												loadMoreUrl="/_api/autocomplete/terminals"
												action={`/accounting/dailyReportLogs/${data.dailyReportLog.id}?/updatePaymentTerminal`}
												successMessage="Successfully updated terminal."
												additionalFormData={{ paymentID: payment.id }}
												classInput="text-xs"
												classValue="text-xs"
											>
												{#snippet valueSnippet()}
													{payment.terminal?.name || '-'}
												{/snippet}
											</SelectEditForm>
										</TableCell>
										<TableCell>
											<TextEditForm
												isDisabled={!(
													data.session.isAdmin ||
													data.session.permissions.find(
														(p) =>
															p.app === 'ACCOUNTING' &&
															p.permissionType === 'EDIT_PAYMENT_AUTHORIZATION_CODE'
													)
												)}
												name="authorizationCode"
												value={payment.authorizationCode}
												action={`/accounting/dailyReportLogs/${data.dailyReportLog.id}?/updatePaymentAuthorizationCode`}
												additionalFormData={{ paymentID: payment.id }}
												successMessage="Successfully updated authorization code."
												classValue="text-xs"
												classInput="text-xs"
											/>
										</TableCell>
										<TableCell>
											<TextEditForm
												isDisabled={!(
													data.session.isAdmin ||
													data.session.permissions.find(
														(p) =>
															p.app === 'ACCOUNTING' && p.permissionType === 'EDIT_PAYMENT_DETAILS'
													)
												)}
												name="details"
												value={payment.details}
												action={`/accounting/dailyReportLogs/${data.dailyReportLog.id}?/updatePaymentDetails`}
												additionalFormData={{ paymentID: payment.id }}
												successMessage="Successfully updated details."
												classValue="text-xs"
												classInput="text-xs"
											/>
										</TableCell>
										<TableCell>
											<TextEditForm
												isDisabled={!(
													data.session.isAdmin ||
													data.session.permissions.find(
														(p) =>
															p.app === 'ACCOUNTING' && p.permissionType === 'EDIT_PAYMENT_AMOUNT'
													)
												)}
												name="amount"
												value={payment.amount}
												action={`/accounting/dailyReportLogs/${data.dailyReportLog.id}?/updatePaymentAmount`}
												additionalFormData={{ paymentID: payment.id }}
												successMessage="Successfully updated amount."
												classValue="text-xs"
												classInput="text-xs"
												classContainer={twMerge(
													'py-1 w-fit tabular-nums break-keep font-medium',
													parseInt(payment.amount as string) < 0 && 'bg-red-50 text-red-700',
													parseInt(payment.amount as string) > 0 && 'bg-green-50 text-green-700',
													parseInt(payment.amount as string) == 0 && 'bg-gray-100 text-gray-700'
												)}
												maskitoOptions={maskitoNumberOptionsGenerator({
													decimalZeroPadding: true,
													thousandSeparator: '',
													precision: 2,
													decimalSeparator: '.',
													minusSign: '-',
													max: payment.transactionType === 'CREDIT_MEMO' ? 0 : 999999999999999.0
												})}
												hideCopyButton
											>
												{#snippet valueSnippet()}
													{@render amountSnippet({ amount: payment.amount })}
												{/snippet}
											</TextEditForm>
										</TableCell>
									</TableCellRow>
								{/each}
								<TableCellRow class="hover:bg-white">
									<TableCell colspan={data.dailyReportLog.payments.length > 1 ? 5 : 6}>
										<NewForm
											label="Add a new payment"
											action={`/accounting/dailyReportLogs/${data.dailyReportLog.id}/?/addPayment`}
											successMessage="Successfully added new payment."
										>
											{#snippet trigger({ onclick })}
												<GhostButton
													isDisabled={!(
														data.session.isAdmin ||
														data.session.permissions.find(
															(p) => p.app === 'ACCOUNTING' && p.permissionType === 'ADD_PAYMENT'
														)
													)}
													{onclick}
													class="p-1.5 text-xs"
													--color-ghostButton="var(--color-blue-600)"
												>
													<PlusIcon />Add New
												</GhostButton>
											{/snippet}

											{#snippet fields()}
												<div class="flex flex-col gap-6">
													<SelectInput
														isRequired
														name="paymentMethodID"
														bind:value={newPayment.paymentMethod.id}
														label="Payment Method"
														loadMoreUrl="/_api/autocomplete/paymentMethods"
														onSelect={(option) => {
															newPayment.paymentMethod = {
																id: option.value as string,
																name: option.label,
																isCard: option.metadata?.isCard
															}
														}}
													/>
													<SelectInput
														name="terminalID"
														label="Terminal"
														bind:value={newPayment.terminalID}
														loadMoreUrl="/_api/autocomplete/terminals"
														isDisabled={!newPayment.paymentMethod.id ||
															!newPayment.paymentMethod.isCard}
													/>
													<TextInput
														name="authorizationCode"
														label="Authorization Code"
														bind:value={newPayment.authorizationCode}
													/>
													<TextInput
														name="details"
														label="Details"
														bind:value={newPayment.details}
														placeholder={newPayment.paymentMethod.isCard ? '4 digit code' : ''}
													/>
													{#if data.dailyReportLog.transactionType === 'CREDIT_MEMO'}
														<Alert type="error" class="-mb-4 w-full font-semibold">
															This is a credit memo. Amount must be negative.
														</Alert>
													{/if}
													<TextInput
														isRequired
														name="amount"
														label="Amount"
														bind:value={newPayment.amount}
														classContainer={twMerge(
															'tabular-nums break-keep font-medium',
															parseInt(newPayment.amount as string) < 0 && 'bg-red-50 text-red-700',
															parseInt(newPayment.amount as string) > 0 &&
																'bg-green-50 text-green-700',
															parseInt(newPayment.amount as string) == 0 &&
																'bg-gray-100 text-gray-700'
														)}
														maskitoOptions={maskitoNumberOptionsGenerator({
															decimalZeroPadding: true,
															thousandSeparator: '',
															precision: 2,
															decimalSeparator: '.',
															minusSign: '-',
															max:
																data.dailyReportLog.transactionType === 'CREDIT_MEMO'
																	? 0
																	: 999999999999999.0
														})}
													/>
												</div>
											{/snippet}
										</NewForm>
									</TableCell>
									{#if data.dailyReportLog.payments.length > 1}
										<TableCell>
											{@render amountSnippet({ amount: data.dailyReportLog.totalAmount })}
										</TableCell>
									{/if}
								</TableCellRow>
							{/snippet}
						</Table>
					</div>
				</div>
			</div>
		</div>

		<div class="flex flex-col gap-4 p-2 lg:col-span-2 lg:gap-8">
			<div class="flex flex-col gap-4 bg-gray-100 p-2 pb-4">
				<h2 class="font-semibold">Verifications</h2>
				<div class="flex flex-col justify-center gap-1 text-center text-xs">
					{#if data.dailyReportLog.needVerifyEnabledBy}
						<div
							class="grid grid-cols-2 items-center justify-between gap-2 border-b border-b-slate-200 bg-slate-50 p-1 py-2 hover:bg-white"
						>
							<div class="pl-1 text-left">Enabled by:</div>
							<div class="flex justify-end">
								<UserLink user={data.dailyReportLog.needVerifyEnabledBy} />
							</div>
						</div>
					{/if}
					{#if data.dailyReportLog.needVerifyDisabledBy}
						<div
							class="grid grid-cols-2 items-center justify-between gap-2 border-b border-b-slate-200 bg-slate-50 p-1 py-2 hover:bg-white"
						>
							<div class="pl-1 text-left">Disabled by:</div>
							<div class="flex justify-end">
								<UserLink user={data.dailyReportLog.needVerifyDisabledBy} />
							</div>
						</div>
					{/if}
					{#each data.dailyReportLog.verifications as verification (verification.id)}
						<div
							class="grid grid-cols-2 items-center justify-between gap-2 border-b border-b-slate-200 bg-slate-50 p-1 py-2 hover:bg-white"
						>
							<TextBlock>
								{new Date(verification.createdAt).toLocaleString('en-CA', {
									year: 'numeric',
									month: '2-digit',
									day: '2-digit',
									hour: '2-digit',
									minute: '2-digit',
									second: '2-digit',
									hour12: false
								})}
							</TextBlock>
							<div class="flex justify-end">
								<UserLink user={verification.user} />
							</div>
						</div>
					{/each}
					{#if !data.dailyReportLog.verifications.find(({ userID }: { userID: string }) => page.data.session.id === userID)}
						<ConfirmForm
							label="Verify Daily Report Log"
							action={`/accounting/dailyReportLogs/${data.dailyReportLog.id}?/verifyDailyReportLog`}
							successMessage="Successfully deleted login approval."
						>
							{#snippet trigger({ onclick })}
								<GhostButton
									class="w-fit pl-0.5 text-xs"
									{onclick}
									--color-ghostButton="var(--color-blue-600)"
								>
									<CheckIcon class="mr-1 size-4" />
									<span>Verify this daily report log</span>
								</GhostButton>
							{/snippet}
							{#snippet fields()}
								<p class="text-sm">Are you sure you want to verify this daily report log?</p>
							{/snippet}
						</ConfirmForm>
					{/if}
				</div>
			</div>

			<ViewNotes
				searchQuery={`?dailyReportLogID=${page.params.id}`}
				newNoteFormAction="/notes?/addDailyReportLogNote"
			/>

			<ViewAuditTrail object={data.dailyReportLog} />

			<ConfirmForm
				label="Delete DailyReportLog"
				action={`/accounting/dailyReportLogs/${data.dailyReportLog.id}?/deleteDailyReportLog`}
				successMessage="Successfully deleted the dailyReportLog."
			>
				{#snippet trigger({ onclick })}
					<SolidButton
						{onclick}
						--color-solidButton="var(--color-red-600)"
						isDisabled={!(
							data.session.isAdmin ||
							data.session.permissions.find(
								(p) => p.app === 'ACCOUNTING' && p.permissionType === 'DELETE_DAILY_REPORT_LOG'
							)
						)}
					>
						<TrashIcon class="mr-1" />
						<span>Delete Daily Report Log</span>
					</SolidButton>
				{/snippet}
				{#snippet fields()}
					<p class="text-sm">Are you sure you want to delete this Daily Report Log?</p>
				{/snippet}
			</ConfirmForm>
		</div>
	</div>
{/if}
