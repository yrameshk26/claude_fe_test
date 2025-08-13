<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'View All Product Types'

	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'

	$effect(() => {
		columnsState.alwaysHiddenColumns = ['']
	})

	import ViewNameDetailsModel from '$lib/components/views/ViewNameDetailsModel.svelte'

	let { data } = $props()
</script>

<ViewNameDetailsModel
	key="allProductTypes"
	{data}
	isNewDisabled={!(
		data.session.isAdmin ||
		data.session.permissions.find(
			(p) => p.app === 'BILLING' && p.permissionType === 'ADD_PRODUCT_TYPE'
		)
	)}
	isNameEditDisabled={!(
		data.session.isAdmin ||
		data.session.permissions.find(
			(p) => p.app === 'BILLING' && p.permissionType === 'EDIT_PRODUCT_TYPE_NAME'
		)
	)}
	isDetailsEditDisabled={!(
		data.session.isAdmin ||
		data.session.permissions.find(
			(p) => p.app === 'BILLING' && p.permissionType === 'EDIT_PRODUCT_TYPE_DETAILS'
		)
	)}
	isDeleteDisabled={!(
		data.session.isAdmin ||
		data.session.permissions.find(
			(p) => p.app === 'BILLING' && p.permissionType === 'DELETE_PRODUCT_TYPE'
		)
	)}
	newLabel="New Product Type"
	newSuccessMessage="Product Type created successfully"
	newAdditionalFormData={{ mutationName: 'CREATE_PRODUCT_TYPE', mutation: 'createProductType' }}
	updateNameAdditionalFormData={{
		mutationName: 'UPDATE_PRODUCT_TYPE_NAME',
		mutation: 'updateProductTypeName'
	}}
	updateDetailsAdditionalFormData={{
		mutationName: 'UPDATE_PRODUCT_TYPE_DETAILS',
		mutation: 'updateProductTypeDetails'
	}}
	deleteLabel="Delete Product Type"
	deleteSuccessMessage="Product Type deleted successfully"
	deleteAdditionalFormData={{ mutationName: 'DELETE_PRODUCT_TYPE', mutation: 'deleteProductType' }}
	sendCustomerMessageAction="/billing/serviceTypeURLs"
	sendCustomerMessageInfo="This will send a message to all customers linked to this product type."
/>
