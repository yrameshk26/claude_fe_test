<script lang="ts" module>
	type Props = {
		user: string
		message: string
	}
</script>

<script lang="ts">
	import { CheckIcon } from '../../icons'
	let { message }: Props = $props()
</script>

<div
	class="flex w-sm items-center gap-2 rounded-md bg-green-600 p-4 text-sm font-medium text-pretty text-green-50"
>
	<CheckIcon />
	<span>{message}</span>
</div>
