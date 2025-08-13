<script lang="ts" module>
	import type { Props as SelectInputProps } from '$sveltewind/components/inputs/SelectInput.svelte'
</script>

<script lang="ts">
	let { ...props }: SelectInputProps = $props()

	import { SelectInput } from '$sveltewind/components/inputs'
	import UserAvatar from './UserAvatar.svelte'
</script>

<SelectInput {...props} loadMoreUrl="/_api/autocomplete/users">
	{#snippet optionSnippet(option)}
		<div class="flex items-center">
			<UserAvatar
				fullName={option.label}
				imageUrl={option.metadata?.imageUrl as string}
				class="size-6"
			/>
			<span class="ml-2">{option.label}</span>
		</div>
	{/snippet}
</SelectInput>
