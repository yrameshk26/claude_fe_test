<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'View All Terminals'

	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'

	$effect(() => {
		columnsState.alwaysHiddenColumns = []
	})

	import ViewNameDetailsModel from '$lib/components/views/ViewNameDetailsModel.svelte'

	let { data } = $props()
</script>

<ViewNameDetailsModel
	key="allTerminals"
	{data}
	isNewDisabled={!(
		data.session.isAdmin ||
		data.session.permissions.find(
			(p) => p.app === 'ACCOUNTING' && p.permissionType === 'ADD_TERMINAL'
		)
	)}
	isNameEditDisabled={!(
		data.session.isAdmin ||
		data.session.permissions.find(
			(p) => p.app === 'ACCOUNTING' && p.permissionType === 'EDIT_TERMINAL_NAME'
		)
	)}
	isDetailsEditDisabled={!(
		data.session.isAdmin ||
		data.session.permissions.find(
			(p) => p.app === 'ACCOUNTING' && p.permissionType === 'EDIT_TERMINAL_DETAILS'
		)
	)}
	isDeleteDisabled={!(
		data.session.isAdmin ||
		data.session.permissions.find(
			(p) => p.app === 'ACCOUNTING' && p.permissionType === 'DELETE_TERMINAL'
		)
	)}
	newLabel="New Terminal"
	newSuccessMessage="Terminal created successfully"
	newAdditionalFormData={{ mutationName: 'CREATE_TERMINAL', mutation: 'createTerminal' }}
	updateNameAdditionalFormData={{
		mutationName: 'UPDATE_TERMINAL_NAME',
		mutation: 'updateTerminalName'
	}}
	updateDetailsAdditionalFormData={{
		mutationName: 'UPDATE_TERMINAL_DETAILS',
		mutation: 'updateTerminalDetails'
	}}
	deleteLabel="Delete Terminal"
	deleteSuccessMessage="Terminal deleted successfully"
	deleteAdditionalFormData={{ mutationName: 'DELETE_TERMINAL', mutation: 'deleteTerminal' }}
/>
