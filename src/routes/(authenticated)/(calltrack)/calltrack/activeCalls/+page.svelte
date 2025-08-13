<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'View Active Calls'

	import ErrorAlertWithReset from '$lib/components/ErrorAlertWithReset.svelte'
	import { TextBlock, Alert } from '$sveltewind/components/display'

	import UserLink from '$lib/components/links/UserLink.svelte'
	import EndActiveCall from '$lib/components/forms/EndActiveCall.svelte'
	import NameDetailsLink from '$lib/components/links/NameDetailsLink.svelte'

	let { data } = $props()

	const formatDuration = (seconds: number = 0) => {
		const hours = Math.floor(seconds / 3600)
		const minutes = Math.floor((seconds % 3600) / 60)
		const remainingSeconds = seconds % 60
		return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(remainingSeconds).padStart(2, '0')}s`
	}
</script>

{#if data.errors}
	<ErrorAlertWithReset errors={data.errors} />
{:else}
	<div class="flex h-full flex-wrap gap-8 overflow-auto">
		{#each data.callRecords ?? [] as callRecord (callRecord.id)}
			<div
				class="flex h-fit min-h-96 max-w-80 flex-col items-center justify-between gap-2 rounded-md bg-slate-200 p-4 px-6 shadow-lg"
			>
				<UserLink user={callRecord.createdByUser} class="flex-col" classIcon="size-20" />
				<div class="flex flex-col items-center gap-0 text-center">
					{#if callRecord.storePhoneNumber}
						<TextBlock>{callRecord.storePhoneNumber.phoneNo}</TextBlock>
						<TextBlock>{callRecord.storePhoneNumber.name}</TextBlock>
					{:else}
						-
					{/if}
				</div>
				<div class="grid grid-cols-4 items-center justify-center gap-2 text-left text-sm">
					<div class="col-span-2">Customer No:</div>
					<div class="col-span-2 items-center">
						<TextBlock class="w-full justify-end text-right"
							>{callRecord.customerPhoneNo}
							{#if callRecord.isNewCustomer}
								<span class="font-bold text-green-600">(new) </span>
							{/if}
						</TextBlock>
					</div>
					<div>Service:</div>
					<div class="col-span-3 items-center">
						<NameDetailsLink
							path="/calltrack/callCategories/levelOne"
							record={callRecord.callCategoryLevelOne}
							class="justify-end text-right"
						/>
					</div>
					<div>Main:</div>
					<div class="col-span-3 items-end justify-end">
						<NameDetailsLink
							path="/calltrack/callCategories/levelTwo"
							record={callRecord.callCategoryLevelTwo}
							class="justify-end text-right"
						/>
					</div>
					<div>Sub:</div>
					<div class="col-span-3 items-end justify-end">
						<NameDetailsLink
							path="/calltrack/callCategories/levelThree"
							record={callRecord.callCategoryLevelThree}
							class="justify-end text-right"
						/>
					</div>
				</div>
				<EndActiveCall {callRecord} class="text-base" />
				<TextBlock class="font-bold"
					>Wait Time: {formatDuration(callRecord.customerWaitSeconds)}</TextBlock
				>
				<TextBlock class="font-bold">{callRecord.callType?.replaceAll('_', ' ')}</TextBlock>
			</div>
		{:else}
			<Alert type="info" class="h-fit">There are no active calls.</Alert>
		{/each}
	</div>
{/if}
