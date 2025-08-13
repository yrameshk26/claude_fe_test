<script lang="ts" module>
	import type { Snippet } from 'svelte'

	type Props = {
		type: 'error' | 'warning' | 'info' | 'success'
		children?: Snippet
		hideIcon?: boolean
		class?: string
		classIcon?: string
	}
</script>

<script lang="ts">
	import { twMerge } from 'tailwind-merge'
	import { SuccessIcon, InfoIcon, ExclamationIcon } from '../../icons'

	let { type, children, hideIcon, class: classContainer, classIcon }: Props = $props()
</script>

<div
	class={twMerge(
		'relative flex w-fit gap-2 rounded-md p-2 text-sm font-medium text-pretty',
		type === 'error' && 'bg-red-50 text-red-700',
		type === 'warning' && 'bg-orange-50 text-orange-500',
		type === 'info' && 'bg-blue-50 text-blue-700',
		type === 'success' && 'bg-green-50 text-green-700',
		!hideIcon && 'pl-8',
		classContainer
	)}
>
	{#if !hideIcon}
		<div class="absolute top-1/2 left-1 -translate-y-1/2 lg:top-1/2">
			{#if type === 'error'}
				<ExclamationIcon class={classIcon} />
			{:else if type === 'warning'}
				<ExclamationIcon class={classIcon} />
			{:else if type === 'info'}
				<InfoIcon class={classIcon} />
			{:else if type === 'success'}
				<SuccessIcon class={classIcon} />
			{/if}
		</div>
	{/if}

	{#if children}
		{@render children()}
	{:else if type === 'error'}
		Error!
	{:else if type === 'warning'}
		Warning!
	{:else if type === 'info'}
		Info!
	{:else if type === 'success'}
		Success!
	{/if}
</div>
