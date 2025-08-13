<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'View All Companies'

	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'

	$effect(() => {
		columnsState.alwaysHiddenColumns = []
	})

	import ViewNameDetailsModel from '$lib/components/views/ViewNameDetailsModel.svelte'

	let { data } = $props()
</script>

<ViewNameDetailsModel
	key="allCompanies"
	{data}
	isNewDisabled={!(
		data.session.isAdmin ||
		data.session.permissions.find(
			(p) => p.app === 'ACCOUNTING' && p.permissionType === 'ADD_COMPANY'
		)
	)}
	isNameEditDisabled={!(
		data.session.isAdmin ||
		data.session.permissions.find(
			(p) => p.app === 'ACCOUNTING' && p.permissionType === 'EDIT_COMPANY_NAME'
		)
	)}
	isDetailsEditDisabled={!(
		data.session.isAdmin ||
		data.session.permissions.find(
			(p) => p.app === 'ACCOUNTING' && p.permissionType === 'EDIT_COMPANY_DETAILS'
		)
	)}
	isDeleteDisabled={!(
		data.session.isAdmin ||
		data.session.permissions.find(
			(p) => p.app === 'ACCOUNTING' && p.permissionType === 'DELETE_COMPANY'
		)
	)}
	newLabel="New Company"
	newSuccessMessage="Company created successfully"
	newAdditionalFormData={{ mutationName: 'CREATE_COMPANY', mutation: 'createCompany' }}
	updateNameAdditionalFormData={{
		mutationName: 'UPDATE_COMPANY_NAME',
		mutation: 'updateCompanyName'
	}}
	updateDetailsAdditionalFormData={{
		mutationName: 'UPDATE_COMPANY_DETAILS',
		mutation: 'updateCompanyDetails'
	}}
	deleteLabel="Delete Company"
	deleteSuccessMessage="Company deleted successfully"
	deleteAdditionalFormData={{ mutationName: 'DELETE_COMPANY', mutation: 'deleteCompany' }}
/>
