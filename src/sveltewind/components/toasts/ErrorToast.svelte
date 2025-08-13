<script lang="ts" module>
	type Props = {
		user: string
		message: string
		extraMessage?: unknown
	}
</script>

<script lang="ts">
	import { XMarkIcon } from '../../icons'
	let { message, extraMessage }: Props = $props()
</script>

<div
	class="flex w-sm items-center gap-2 rounded-md bg-red-600 p-4 text-sm font-medium text-pretty text-red-50"
>
	<XMarkIcon />
	<span>{message}</span>

	{#if extraMessage}
		<span class="text-xs text-gray-300"> {JSON.stringify(extraMessage)} </span>
	{/if}
</div>
