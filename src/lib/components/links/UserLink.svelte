<script lang="ts" module>
	type Props = {
		user?: {
			id: string
			fullName: string
			imageUrl?: string
		}
		class?: string
		classText?: string
		classIcon?: string
	}
</script>

<script lang="ts">
	let { user, class: classes, classText, classIcon }: Props = $props()

	import UserAvatar from '../UserAvatar.svelte'
	import { TextBlock } from '$sveltewind/components/display'
	import { twMerge } from 'tailwind-merge'
</script>

{#if user}
	<div class={twMerge('flex items-center gap-2', classes)}>
		<UserAvatar
			fullName={user.fullName}
			imageUrl={user.imageUrl}
			class={twMerge('size-5', classIcon)}
		/>
		<TextBlock href={`/management/staffs/${user.id}`} class={classText}>{user.fullName}</TextBlock>
	</div>
{:else}
	-
{/if}
