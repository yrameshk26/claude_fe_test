<script lang="ts">
	import { GhostButton } from '$sveltewind/components/buttons'

	import { LogoutIcon } from '$icons'

	import { page } from '$app/state'
</script>

<GhostButton
	class="-mr-2 bg-gray-900/20 p-1 text-xs text-white hover:bg-gray-800/50 focus-visible:bg-gray-800 lg:px-4 lg:py-3"
	href={page.data.session.activeCall
		? `/calltrack/callRecords/${page.data.session.activeCall.id}`
		: '/logout'}
	data-sveltekit-reload
>
	<LogoutIcon class="size-7 text-red-400" />
	<span class="sr-only">Logout</span>
</GhostButton>
