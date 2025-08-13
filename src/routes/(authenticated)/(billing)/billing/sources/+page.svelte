<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'View All Sources'

	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'

	$effect(() => {
		columnsState.alwaysHiddenColumns = []
	})

	import ViewNameDetailsModel from '$lib/components/views/ViewNameDetailsModel.svelte'

	let { data } = $props()
</script>

<ViewNameDetailsModel
	key="allSources"
	{data}
	isNewDisabled={!(
		data.session.isAdmin ||
		data.session.permissions.find((p) => p.app === 'BILLING' && p.permissionType === 'ADD_SOURCE')
	)}
	isNameEditDisabled={!(
		data.session.isAdmin ||
		data.session.permissions.find(
			(p) => p.app === 'BILLING' && p.permissionType === 'EDIT_SOURCE_NAME'
		)
	)}
	isDetailsEditDisabled={!(
		data.session.isAdmin ||
		data.session.permissions.find(
			(p) => p.app === 'BILLING' && p.permissionType === 'EDIT_SOURCE_DETAILS'
		)
	)}
	isDeleteDisabled={!(
		data.session.isAdmin ||
		data.session.permissions.find(
			(p) => p.app === 'BILLING' && p.permissionType === 'DELETE_SOURCE'
		)
	)}
	newLabel="New Source"
	newSuccessMessage="Source created successfully"
	newAdditionalFormData={{ mutationName: 'CREATE_SOURCE', mutation: 'createSource' }}
	updateNameAdditionalFormData={{
		mutationName: 'UPDATE_SOURCE_NAME',
		mutation: 'updateSourceName'
	}}
	updateDetailsAdditionalFormData={{
		mutationName: 'UPDATE_SOURCE_DETAILS',
		mutation: 'updateSourceDetails'
	}}
	deleteLabel="Delete Source"
	deleteSuccessMessage="Source deleted successfully"
	deleteAdditionalFormData={{ mutationName: 'DELETE_SOURCE', mutation: 'deleteSource' }}
	sendCustomerMessageAction="/billing/sources"
	sendCustomerMessageInfo="This will send a message to all customers linked to this source."
/>
