<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'View All Languages'

	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'

	$effect(() => {
		columnsState.alwaysHiddenColumns = ['']
	})

	import ViewNameDetailsModel from '$lib/components/views/ViewNameDetailsModel.svelte'

	let { data } = $props()
</script>

<ViewNameDetailsModel
	key="allLanguages"
	{data}
	isNewDisabled={!(
		data.session.isAdmin ||
		data.session.permissions.find((p) => p.app === 'BILLING' && p.permissionType === 'ADD_LANGUAGE')
	)}
	isNameEditDisabled={!(
		data.session.isAdmin ||
		data.session.permissions.find(
			(p) => p.app === 'BILLING' && p.permissionType === 'EDIT_LANGUAGE_NAME'
		)
	)}
	isDetailsEditDisabled={!(
		data.session.isAdmin ||
		data.session.permissions.find(
			(p) => p.app === 'BILLING' && p.permissionType === 'EDIT_LANGUAGE_DETAILS'
		)
	)}
	isDeleteDisabled={!(
		data.session.isAdmin ||
		data.session.permissions.find(
			(p) => p.app === 'BILLING' && p.permissionType === 'DELETE_LANGUAGE'
		)
	)}
	newLabel="New Language"
	newSuccessMessage="Language created successfully"
	newAdditionalFormData={{ mutationName: 'CREATE_LANGUAGE', mutation: 'createLanguage' }}
	updateNameAdditionalFormData={{
		mutationName: 'UPDATE_LANGUAGE_NAME',
		mutation: 'updateLanguageName'
	}}
	updateDetailsAdditionalFormData={{
		mutationName: 'UPDATE_LANGUAGE_DETAILS',
		mutation: 'updateLanguageDetails'
	}}
	deleteLabel="Delete Language"
	deleteSuccessMessage="Language deleted successfully"
	deleteAdditionalFormData={{ mutationName: 'DELETE_LANGUAGE', mutation: 'deleteLanguage' }}
	sendCustomerMessageAction="/billing/languages"
	sendCustomerMessageInfo="This will send a message to all customers linked to this Language."
/>
