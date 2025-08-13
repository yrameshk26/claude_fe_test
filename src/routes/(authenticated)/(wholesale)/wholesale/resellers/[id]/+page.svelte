<script>
	import ViewWholesaler from '$lib/components/views/ViewWholesaler.svelte'

	let { data } = $props()
</script>

<ViewWholesaler {data} viewPath="/wholesale/resellers" key="Reseller" permissionType="RESELLER" />
