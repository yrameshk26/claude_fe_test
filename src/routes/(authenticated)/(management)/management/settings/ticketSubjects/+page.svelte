<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'View All Ticket Subjects'

	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'

	$effect(() => {
		columnsState.alwaysHiddenColumns = []
	})

	import ViewNameDetailsModel from '$lib/components/views/ViewNameDetailsModel.svelte'

	let { data } = $props()
</script>

<ViewNameDetailsModel
	key="allTicketSubjects"
	{data}
	newLabel="New Ticket Subject"
	isNewDisabled={!(
		data.session.isAdmin ||
		data.session.permissions.find(
			(p) => p.app === 'MANAGEMENT' && p.permissionType === 'ADD_TICKET_SUBJECT'
		)
	)}
	isNameEditDisabled={!(
		data.session.isAdmin ||
		data.session.permissions.find(
			(p) => p.app === 'MANAGEMENT' && p.permissionType === 'EDIT_TICKET_SUBJECT_NAME'
		)
	)}
	isDetailsEditDisabled={!(
		data.session.isAdmin ||
		data.session.permissions.find(
			(p) => p.app === 'MANAGEMENT' && p.permissionType === 'EDIT_TICKET_SUBJECT_DETAILS'
		)
	)}
	isDeleteDisabled={!(
		data.session.isAdmin ||
		data.session.permissions.find(
			(p) => p.app === 'MANAGEMENT' && p.permissionType === 'DELETE_TICKET_SUBJECT'
		)
	)}
	newSuccessMessage="Ticket Subject created successfully"
	newAdditionalFormData={{ mutationName: 'CREATE_TICKET_SUBJECT', mutation: 'createTicketSubject' }}
	updateNameAdditionalFormData={{
		mutationName: 'UPDATE_TICKET_SUBJECT_NAME',
		mutation: 'updateTicketSubjectName'
	}}
	updateDetailsAdditionalFormData={{
		mutationName: 'UPDATE_TICKET_SUBJECT_DETAILS',
		mutation: 'updateTicketSubjectDetails'
	}}
	deleteLabel="Delete Ticket Subject"
	deleteSuccessMessage="Ticket Subject deleted successfully"
	deleteAdditionalFormData={{
		mutationName: 'DELETE_TICKET_SUBJECT',
		mutation: 'deleteTicketSubject'
	}}
/>
