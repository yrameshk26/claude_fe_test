<script lang="ts" module>
	export type Props = {
		filterCount: number
		totalCount: number
		limit?: number
		hideTotalCount?: boolean
		hideLimit?: boolean
		hideFiltersReset?: boolean
	}

	const createRange = (start: number, end: number) => {
		const length = end - start + 1
		return Array.from({ length }, (_, idx) => idx + start)
	}

	const getPaginationRange = ({
		currentPage,
		filterCount,
		limit
	}: {
		currentPage: number
		filterCount: number
		limit: number
	}) => {
		const siblingCount = 1
		const totalPageCount = Math.ceil(filterCount / limit)
		// Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
		const totalPageNumbers = siblingCount + 5
		/*
      Case 1:
      If the number of pages is less than the page numbers we want to show in our
      paginationComponent, we return the range [1..totalPageCount]
    */
		if (totalPageNumbers >= totalPageCount) {
			return createRange(1, totalPageCount)
		}
		/*
      Calculate left and right sibling index and make sure they are within range 1 and totalPageCount
    */
		const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
		const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount)
		/*
      We do not show dots just when there is just one page number to be inserted between the extremes of sibling and the page limits i.e 1 and totalPageCount. Hence we are using leftSiblingIndex > 2 and rightSiblingIndex < totalPageCount - 2
    */
		const shouldShowLeftDots = leftSiblingIndex > 2
		const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2
		const firstPageIndex = 1
		const lastPageIndex = totalPageCount
		/*
      Case 2: No left dots to show, but rights dots to be shown
    */
		if (!shouldShowLeftDots && shouldShowRightDots) {
			const leftItemCount = 3 + 2 * siblingCount
			const leftRange = createRange(1, leftItemCount)
			return [...leftRange, -1, totalPageCount]
		}
		/*
      Case 3: No right dots to show, but left dots to be shown
    */
		if (shouldShowLeftDots && !shouldShowRightDots) {
			const rightItemCount = 3 + 2 * siblingCount
			const rightRange = createRange(totalPageCount - rightItemCount + 1, totalPageCount)
			return [firstPageIndex, -1, ...rightRange]
		}
		/*
      Case 4: Both left and right dots to be shown
    */
		if (shouldShowLeftDots && shouldShowRightDots) {
			const middleRange = createRange(leftSiblingIndex, rightSiblingIndex)
			return [firstPageIndex, -1, ...middleRange, -1, lastPageIndex]
		}
	}
</script>

<script lang="ts">
	let {
		filterCount,
		totalCount,
		limit: defaultLimit = 25,
		hideTotalCount = false,
		hideLimit = false
		// hideFiltersReset = false
	}: Props = $props()

	import Dropdown from '../display/Dropdown.svelte'
	import { GhostButton } from '../buttons'
	// import { Alert } from '../display'
	import {
		AdjustmentsIcon,
		ChevronLeftIcon,
		ChevronRightIcon,
		EllipsisHorizontalIcon
		// RefreshIcon
	} from '../../icons'

	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { twMerge } from 'tailwind-merge'

	let limit = $derived(parseInt(page.url.searchParams.get('limit') || defaultLimit + ''))
	let currentPage = $derived(parseInt(page.url.searchParams.get('page') || '1'))

	let showingCountFrom = $derived((currentPage - 1) * limit + 1)
	let showingCountTo = $derived(Math.min(currentPage * limit, filterCount))

	function onPreviousPage() {
		const searchParams = new URLSearchParams(page.url.searchParams.toString())
		searchParams.set('page', (currentPage - 1).toString())
		goto(`?${searchParams.toString()}`)
	}

	function onNextPage() {
		const searchParams = new URLSearchParams(page.url.searchParams.toString())
		searchParams.set('page', (currentPage + 1).toString())
		goto(`?${searchParams.toString()}`)
	}

	function onChangePage(pageNumber: number) {
		const searchParams = new URLSearchParams(page.url.searchParams.toString())
		searchParams.set('page', pageNumber.toString())
		goto(`?${searchParams.toString()}`)
	}

	function onPageLimitChange(pageLimit: number) {
		const searchParams = new URLSearchParams(page.url.searchParams.toString())
		searchParams.set('limit', pageLimit.toString())
		searchParams.set('page', '1')
		goto(`?${searchParams.toString()}`)
	}

	let paginationRange = $derived(
		getPaginationRange({ currentPage, filterCount, limit }) as number[]
	)
</script>

<div>
	<div class="flex w-full flex-col items-center gap-1 lg:flex-row">
		<div class="flex items-center gap-2 rounded-md px-2 text-sm">
			{#if !hideLimit}
				<Dropdown placement="bottom-left">
					{#snippet trigger({ open, close, isOpen })}
						<GhostButton class="p-1" onclick={isOpen ? close : open}>
							<span class="sr-only">Open page limit menu</span>
							<AdjustmentsIcon class="size-5" />
						</GhostButton>
					{/snippet}
					<div
						class="outline-textInput/20 flex min-w-[8rem] flex-col gap-2 rounded-md bg-white p-2 outline outline-1"
					>
						{#each [25, 50, 100] as pageLimit (pageLimit)}
							<GhostButton
								onclick={() => onPageLimitChange(pageLimit)}
								class="justify-start text-xs "
							>
								Limit: {pageLimit}
							</GhostButton>
						{/each}
					</div>
				</Dropdown>
			{/if}
			{#if filterCount !== 0}
				<p class="text-xs text-nowrap">
					Showing
					<span id="pagination">
						<span class="font-extrabold">{showingCountFrom}</span>
						to <span class="font-extrabold">{showingCountTo}</span> of
						<span class="font-extrabold"
							>{filterCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span
						>
					</span>
					{#if filterCount !== totalCount && !hideTotalCount}
						filtered results from <span class="font-extrabold"
							>{totalCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span
						> total
					{/if}
				</p>
			{:else}
				<p class="text-xs text-nowrap">No results found</p>
			{/if}
		</div>

		<nav class="isolate inline-flex -space-x-px rounded-md bg-white" aria-label="Pagination">
			<button
				disabled={currentPage === 1}
				onclick={onPreviousPage}
				class="relative inline-flex cursor-pointer items-center rounded-l-md p-1 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-100 focus:z-20 focus:ring-2 focus:ring-slate-600 focus:ring-offset-white focus:outline-offset-0 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600 disabled:opacity-50"
			>
				<span class="sr-only">Previous</span>
				<ChevronLeftIcon />
			</button>
			{#each paginationRange as pageNumber (pageNumber)}
				{#if pageNumber === -1}
					<div
						class="relative inline-flex items-center p-0.5 text-xs text-gray-900 ring-1 ring-gray-300 select-none ring-inset focus:z-20"
					>
						<EllipsisHorizontalIcon />
					</div>
				{:else}
					<button
						onclick={() => onChangePage(pageNumber)}
						class={twMerge(
							'relative inline-flex cursor-pointer items-center px-3 py-1 text-xs font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset focus:z-20 focus:ring-2 focus:ring-slate-600 focus:ring-offset-white  focus:outline-none ',
							pageNumber === currentPage &&
								'bg-slate-600 text-white ring-2 ring-slate-600 hover:bg-slate-700',
							pageNumber !== currentPage && 'hover:bg-gray-100'
						)}
					>
						{pageNumber}
					</button>
				{/if}
			{/each}
			<button
				disabled={currentPage === Math.ceil(filterCount / limit) || filterCount === 0}
				onclick={onNextPage}
				class="relative inline-flex cursor-pointer items-center rounded-r-md p-1 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-100 focus:z-20 focus:ring-2 focus:ring-slate-600 focus:ring-offset-white focus:outline-offset-0 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-600 disabled:opacity-50"
			>
				<span class="sr-only">Next</span>
				<ChevronRightIcon />
			</button>
		</nav>
	</div>
</div>
