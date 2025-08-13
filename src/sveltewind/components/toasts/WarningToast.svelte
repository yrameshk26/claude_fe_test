<script lang="ts" module>
	type Props = {
		user: string
		message: string
	}
</script>

<script lang="ts">
	import { ExclamationIcon } from '../../icons'
	let { message }: Props = $props()
</script>

<div
	class="flex w-sm items-center gap-2 rounded-md bg-orange-600 p-4 text-sm font-medium text-pretty text-orange-50"
>
	<ExclamationIcon />
	<span>{message}</span>
</div>
