<script lang="ts" module>
	export type Props = {
		sortBy: string
		class?: string
	}
</script>

<script lang="ts">
	import { GhostButton } from '../buttons'
	import { ArrowsUpDownIcon, ArrowUpIcon, ArrowDownIcon } from '../../icons'

	import { twMerge } from 'tailwind-merge'

	import { page } from '$app/state'
	import { goto } from '$app/navigation'

	let { sortBy, class: classes }: Props = $props()

	const onClick = () => {
		const url = new URL(page.url)
		const currentSortBy = url.searchParams.get('sortBy')
		let newSortBy = sortBy

		if (currentSortBy === sortBy) {
			newSortBy = `-${sortBy}`
		} else if (currentSortBy === `-${sortBy}`) {
			newSortBy = ''
		}

		if (newSortBy) {
			url.searchParams.set('sortBy', newSortBy)
		} else {
			url.searchParams.delete('sortBy')
		}
		goto(url.toString(), { noScroll: true, replaceState: true })
	}
</script>

<GhostButton
	class={twMerge(
		'w-fit',
		(page.url.searchParams.get('sortBy') === sortBy ||
			page.url.searchParams.get('sortBy') === `-${sortBy}`) &&
			'bg-amber-400 text-black hover:bg-amber-500 focus-visible:bg-amber-500',
		classes
	)}
	onclick={onClick}
>
	{#if page.url.searchParams.get('sortBy') === sortBy}
		<ArrowDownIcon class="size-4" />
	{:else if page.url.searchParams.get('sortBy') === `-${sortBy}`}
		<ArrowUpIcon class="size-4" />
	{:else}
		<ArrowsUpDownIcon class="size-4" />
	{/if}
</GhostButton>
