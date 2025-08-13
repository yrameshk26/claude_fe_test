<script lang="ts" module>
	type Props = {
		fullName: string
		imageUrl?: string
		class?: string
	}
</script>

<script lang="ts">
	let { fullName, imageUrl, class: classes }: Props = $props()

	import { twMerge } from 'tailwind-merge'

	// random complementary colors for user avatars
	const RANDOM_COLORS = [
		'#f44336',
		'#9c27b0',
		'#673ab7',
		'#3f51b5',
		'#2196f3',
		'#009688',
		'#4caf50',
		'#ffc107',
		'#ff5722',
		'#795548',
		'#607d8b',
		'#e91e63'
	]
</script>

{#if imageUrl}
	<img src={imageUrl} alt="User Avatar" class={twMerge('size-10 rounded-full', classes)} />
{:else}
	<div
		class={twMerge('inline-flex size-10 items-center justify-center rounded-full ', classes)}
		style:background={RANDOM_COLORS[fullName.charCodeAt(3) % RANDOM_COLORS.length]}
	>
		<div class="flex items-center text-base leading-none font-medium text-white">
			{fullName.split(' ')[0].charAt(0).toUpperCase()}{fullName
				.split(' ')[1]
				?.charAt(0)
				.toUpperCase() || ''}
		</div>
	</div>
{/if}
