<script lang="ts" module>
	import type { Props } from './TextInput.svelte'
</script>

<script lang="ts">
	import TextInput from './TextInput.svelte'
	import { EyeIcon, EyeSlashIcon } from '../../icons'

	let { value = $bindable(''), ...restInputProps }: Props = $props()
	let type: Props['type'] = $state('password')
</script>

<TextInput bind:type bind:value autocomplete="off" {...restInputProps}>
	{#snippet rightChildren()}
		<button
			type="button"
			tabindex={-1}
			class="text-textInput active:translate-y-0.5"
			onclick={() => {
				type = type === 'password' ? 'text' : 'password'
			}}
		>
			{#if type !== 'password'}
				<EyeIcon />
				<span class="sr-only">Hide password</span>
			{:else}
				<EyeSlashIcon />
				<span class="sr-only">Show password</span>
			{/if}
		</button>
	{/snippet}
</TextInput>
