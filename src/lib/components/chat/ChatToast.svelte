<script lang="ts" module>
	import { toastState } from '$sveltewind/components/display/Toast.svelte'
	import { chatState } from './ChatSidebar.svelte'

	type Props = {
		authUserID: string
		authUserFullName: string
		authUserImage: string
		message: string
		toast: (typeof toastState)['toasts'][number]
	}
</script>

<script lang="ts">
	let { authUserID, authUserFullName, authUserImage, message, toast }: Props = $props()

	import UserAvatar from '../UserAvatar.svelte'
	import { GhostButton, SolidButton } from '$sveltewind/components/buttons'
</script>

<div
	class="flex w-sm justify-between gap-2 rounded-md bg-yellow-100 p-4 text-sm font-medium text-pretty"
>
	<div class="flex items-center gap-2">
		<UserAvatar fullName={authUserFullName} imageUrl={authUserImage} class="size-6" />
		<div class="break-all">
			<div>From {authUserFullName}:</div>
			<div>{message}</div>
		</div>
	</div>
	<div class="flex flex-col justify-end gap-2">
		<GhostButton
			class=""
			onclick={() => toastState.close(toast.id)}
			--color-ghostButton="var(--color-red-600)">Close</GhostButton
		>
		<SolidButton
			class=""
			onclick={() => {
				chatState.activeOtherUserId = authUserID
				chatState.isOpen = true
				toastState.close(toast.id)
			}}
			--color-solidButton="var(--color-orange-600)">Open</SolidButton
		>
	</div>
</div>
