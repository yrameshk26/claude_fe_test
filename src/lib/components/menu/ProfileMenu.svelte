<script lang="ts">
	import { GhostButton } from '$sveltewind/components/buttons'

	import UserAvatar from '../UserAvatar.svelte'

	import { page } from '$app/state'
</script>

<GhostButton
	class="w-fit shrink-0 gap-2 p-2 text-xs text-white hover:bg-gray-800/50 focus-visible:bg-gray-700"
	href="/"
>
	<UserAvatar
		class="mb-1 size-9"
		fullName={page.data.session.fullName}
		imageUrl={page.data.session.imageUrl}
	/>
	<span class="sr-only">Open user menu</span>
	<span class="hidden sm:block">{page.data.session.fullName}</span>
</GhostButton>
