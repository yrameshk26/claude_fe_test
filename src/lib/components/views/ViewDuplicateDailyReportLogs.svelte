<script lang="ts">
	import { GhostButton } from '$sveltewind/components/buttons'
	import { goto } from '$app/navigation'
	import { twMerge } from 'tailwind-merge'

	import { page } from '$app/state'

	let isLoading = $state(false)

	const findDuplicates = async () => {
		const url = new URL(page.url)
		if (page.url.searchParams.get('duplicates') === 'true') {
			url.searchParams.delete('duplicates')
		} else {
			url.searchParams.set('duplicates', 'true')
		}
		goto(url.toString(), { noScroll: true, replaceState: true })
	}
</script>

<GhostButton
	onclick={findDuplicates}
	{isLoading}
	class={twMerge(
		'text-xs text-orange-600 hover:text-orange-900',
		page.url.searchParams.get('duplicates') === 'true' &&
			' bg-amber-500 text-white hover:bg-amber-600 focus-visible:bg-amber-600'
	)}
>
	Find Duplicates
</GhostButton>
