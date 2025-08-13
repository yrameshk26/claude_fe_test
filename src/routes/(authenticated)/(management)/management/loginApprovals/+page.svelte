<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'View All Login Approvals'

	import ViewLoginApprovals from '$lib/components/views/ViewLoginApprovals.svelte'

	let { data } = $props()
</script>

<ViewLoginApprovals key="allLoginApprovals" {data} />
