<script lang="ts">
	import ViewLoginApprovals from '$lib/components/views/ViewLoginApprovals.svelte'

	let { data } = $props()
</script>

<ViewLoginApprovals key="staffLoginApprovals" {data} alwaysHiddenColumns={['requestedBy']} />
