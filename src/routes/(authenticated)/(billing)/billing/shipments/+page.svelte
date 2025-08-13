<script lang="ts">
	import { headerState } from '$sveltewind/components/layouts/Header.svelte'
	headerState.title = 'View All Shipments'

	import { columnsState } from '$sveltewind/components/table/TableColumnsToggle.svelte'

	$effect(() => {
		columnsState.alwaysHiddenColumns = []
	})

	import ViewNameDetailsModel from '$lib/components/views/ViewNameDetailsModel.svelte'

	let { data } = $props()
</script>

<ViewNameDetailsModel
	key="allShipments"
	{data}
	isNewDisabled={!(
		data.session.isAdmin ||
		data.session.permissions.find((p) => p.app === 'BILLING' && p.permissionType === 'ADD_SHIPMENT')
	)}
	isNameEditDisabled={!(
		data.session.isAdmin ||
		data.session.permissions.find(
			(p) => p.app === 'BILLING' && p.permissionType === 'EDIT_SHIPMENT_NAME'
		)
	)}
	isDetailsEditDisabled={!(
		data.session.isAdmin ||
		data.session.permissions.find(
			(p) => p.app === 'BILLING' && p.permissionType === 'EDIT_SHIPMENT_DETAILS'
		)
	)}
	isDeleteDisabled={!(
		data.session.isAdmin ||
		data.session.permissions.find(
			(p) => p.app === 'BILLING' && p.permissionType === 'DELETE_SHIPMENT'
		)
	)}
	newLabel="New Shipment"
	newSuccessMessage="Shipment created successfully"
	newAdditionalFormData={{ mutationName: 'CREATE_SHIPMENT', mutation: 'createShipment' }}
	updateNameAdditionalFormData={{
		mutationName: 'UPDATE_SHIPMENT_NAME',
		mutation: 'updateShipmentName'
	}}
	updateDetailsAdditionalFormData={{
		mutationName: 'UPDATE_SHIPMENT_DETAILS',
		mutation: 'updateShipmentDetails'
	}}
	deleteLabel="Delete Shipment"
	deleteSuccessMessage="Shipment deleted successfully"
	deleteAdditionalFormData={{ mutationName: 'DELETE_SHIPMENT', mutation: 'deleteShipment' }}
	sendCustomerMessageAction="/billing/shipments"
	sendCustomerMessageInfo="This will send a message to all customers linked to this shipment."
/>
