import type { SearchTermsType } from '$sveltewind/components/filters/Search.svelte'

export const getCustomerFilters = (isEmbedded: boolean = false) => {
	const searchTerms = {} as SearchTermsType
	searchTerms['quickSearch'] = {
		label: 'Quick Search',
		type: 'quickSearch',
		placeholder: 'Search by Full Name or Phone Number',
		filters: [
			{
				field: 'fullName'
			},
			{
				field: 'phoneNumbers',
				relationIsMany: true,
				relationField: 'value'
			}
		]
	}
	searchTerms['id'] = {
		isHidden: !isEmbedded,
		label: 'Quick Select',
		type: 'select',
		isEnum: true,
		loadMoreUrl: '/_api/autocomplete/customers'
	}
	searchTerms['joinedDate'] = {
		label: 'Joined Date',
		type: 'date'
	}
	searchTerms['fullName'] = {
		label: 'Full Name',
		type: 'string'
	}
	searchTerms['email'] = {
		label: 'Email',
		type: 'string'
	}
	if (!isEmbedded) {
		searchTerms['phoneNumbers'] = {
			label: 'Phone Numbers',
			type: 'relation',
			relationIsMany: true,
			relations: getPhoneNumberFilters()
		}
		searchTerms['services'] = {
			label: 'Services',
			type: 'relation',
			relationIsMany: true,
			relations: getServiceFilters(true)
		}
		searchTerms['transactions'] = {
			label: 'Transactions',
			type: 'relation',
			relationIsMany: true,
			relations: getTransactionFilters(true)
		}
		searchTerms['tickets'] = {
			label: 'Tickets',
			type: 'relation',
			relationIsMany: true,
			relations: getTicketFilters(true)
		}
		searchTerms['notes'] = {
			label: 'Notes',
			type: 'relation',
			relationIsMany: true,
			relations: getNoteFilters()
		}
	}
	if (!isEmbedded) {
		searchTerms['city'] = {
			label: 'City',
			type: 'string'
		}
		searchTerms['province'] = {
			label: 'Province',
			type: 'string'
		}
		searchTerms['postalCode'] = {
			label: 'Postal Code',
			type: 'string'
		}
		searchTerms['country'] = {
			label: 'Country',
			type: 'string'
		}
	}
	if (isEmbedded) {
		searchTerms['sourceID'] = {
			label: 'Source',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/sources'
		}
		searchTerms['languageID'] = {
			label: 'Language',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/languages'
		}
	} else {
		searchTerms['source'] = {
			label: 'Source',
			type: 'relation',
			relations: getSourceFilters(true)
		}
		searchTerms['language'] = {
			label: 'Language',
			type: 'relation',
			relations: getLanguageFilters(true)
		}
	}
	searchTerms['isFromCall'] = {
		label: 'Is From Call',
		type: 'boolean'
	}
	searchTerms['isTrial'] = {
		label: 'Is Trial',
		type: 'boolean'
	}
	searchTerms['skipPromotion'] = {
		label: 'Skip Promotion',
		type: 'boolean'
	}
	searchTerms['sendReminderBy'] = {
		label: 'Send Reminder By',
		type: 'select',
		isEnum: true,
		options: [
			{ label: 'Email', value: 'EMAIL' },
			{ label: 'SMS', value: 'SMS' },
			{ label: 'Whatsapp', value: 'WHATSAPP' }
		]
	}
	if (isEmbedded) {
		searchTerms['handledBy'] = {
			label: 'Handled By',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/users'
		}
		searchTerms['createdBy'] = {
			label: 'Created By',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/users'
		}
		searchTerms['updatedBy'] = {
			label: 'Updated By',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/users'
		}
	} else {
		searchTerms['handledByUser'] = {
			label: 'Handled By Staff',
			type: 'relation',
			relations: getUserFilters(true)
		}
		searchTerms['createdByUser'] = {
			label: 'Created By Staff',
			type: 'relation',
			relations: getUserFilters(true)
		}
		searchTerms['updatedByUser'] = {
			label: 'Updated By Staff',
			type: 'relation',
			relations: getUserFilters(true)
		}
	}
	searchTerms['createdAt'] = {
		label: 'Created At',
		type: 'date',
		addTime: true
	}
	searchTerms['updatedAt'] = {
		label: 'Updated At',
		type: 'date',
		addTime: true
	}
	if (isEmbedded) {
		searchTerms['isEmpty'] = {
			label: 'Is Empty',
			type: 'boolean'
		}
		searchTerms['isNotEmpty'] = {
			label: 'Is Not Empty',
			type: 'boolean'
		}
	}
	return searchTerms
}

const getPhoneNumberFilters = () => {
	const searchTerms = {} as SearchTermsType
	searchTerms['Value'] = {
		label: 'Value',
		type: 'string'
	}
	searchTerms['type'] = {
		label: 'Type',
		type: 'select',
		options: [
			{
				label: 'Mobile',
				value: 'MOBILE'
			},
			{
				label: 'Landline',
				value: 'LANDLINE'
			},
			{
				label: 'Business',
				value: 'BUSINESS'
			}
		]
	}
	searchTerms['isEmpty'] = {
		label: 'Is Empty',
		type: 'boolean'
	}
	searchTerms['isNotEmpty'] = {
		label: 'Is Not Empty',
		type: 'boolean'
	}
	return searchTerms
}

const getNameDetailsFilters = (loadMoreUrl: string, isEmbedded: boolean = false) => {
	const searchTerms = {} as SearchTermsType
	searchTerms['id'] = {
		isHidden: !isEmbedded,
		label: 'Quick Select',
		type: 'select',
		isEnum: true,
		loadMoreUrl
	}
	searchTerms['quickSearch'] = {
		label: 'Quick Search',
		type: 'quickSearch',
		placeholder: 'Search by Name or Details',
		filters: [
			{
				field: 'name'
			},
			{
				field: 'details'
			}
		]
	}
	searchTerms['name'] = {
		label: 'Name',
		type: 'string'
	}
	searchTerms['details'] = {
		label: 'Details',
		type: 'string'
	}
	searchTerms['updatedAt'] = {
		label: 'Updated At',
		type: 'date',
		addTime: true
	}
	searchTerms['createdAt'] = {
		label: 'Created At',
		type: 'date',
		addTime: true
	}
	if (isEmbedded) {
		searchTerms['isEmpty'] = {
			label: 'Is Empty',
			type: 'boolean'
		}
		searchTerms['isNotEmpty'] = {
			label: 'Is Not Empty',
			type: 'boolean'
		}
	}
	return searchTerms
}

export const getSourceFilters = (isEmbedded: boolean = false) => {
	if (isEmbedded) {
		return getNameDetailsFilters('/_api/autocomplete/sources', isEmbedded)
	} else {
		return {
			...getNameDetailsFilters('/_api/autocomplete/sources', isEmbedded),
			customers: {
				label: 'Customers',
				type: 'relation',
				relationIsMany: true,
				relations: getCustomerFilters(true)
			}
		}
	}
}

export const getLanguageFilters = (isEmbedded: boolean = false) => {
	if (isEmbedded) {
		return getNameDetailsFilters('/_api/autocomplete/languages', isEmbedded)
	} else {
		return {
			...getNameDetailsFilters('/_api/autocomplete/languages', isEmbedded),
			customers: {
				label: 'Customers',
				type: 'relation',
				relationIsMany: true,
				relations: getCustomerFilters(true)
			}
		}
	}
}

export const getUserFilters = (isEmbedded: boolean = false) => {
	const searchTerms = {} as SearchTermsType
	searchTerms['id'] = {
		isHidden: !isEmbedded,
		label: 'Quick Select',
		type: 'select',
		isEnum: true,
		loadMoreUrl: '/_api/autocomplete/users'
	}
	searchTerms['quickSearch'] = {
		label: 'Quick Search',
		type: 'quickSearch',
		placeholder: 'Search by Full Name, Email, or Phone Number',
		filters: [
			{
				field: 'fullName'
			},
			{
				field: 'email'
			},
			{
				field: 'phoneNumbers',
				relationIsMany: true,
				relationField: 'value'
			}
		]
	}
	searchTerms['fullName'] = {
		label: 'Full Name',
		type: 'string'
	}
	searchTerms['email'] = {
		label: 'Email',
		type: 'string'
	}
	if (!isEmbedded) {
		searchTerms['phoneNumbers'] = {
			label: 'Phone Numbers',
			type: 'relation',
			relationIsMany: true,
			relations: getPhoneNumberFilters()
		}
	}
	searchTerms['isAdmin'] = {
		label: 'Is Admin',
		type: 'boolean'
	}
	searchTerms['isLocked'] = {
		label: 'Is Locked',
		type: 'boolean'
	}
	searchTerms['isDeleted'] = {
		label: 'Is Deleted',
		type: 'boolean'
	}
	searchTerms['requiredOTP'] = {
		label: 'Required OTP',
		type: 'boolean'
	}
	searchTerms['lastLoginDate'] = {
		label: 'Last Login Date',
		type: 'date',
		addTime: true
	}
	searchTerms['lastLoginDateTime'] = {
		field: 'lastLoginDate',
		label: 'Last Login Date Time',
		type: 'datetime'
	}
	searchTerms['updatedAt'] = {
		label: 'Updated At',
		type: 'date',
		addTime: true
	}
	if (!isEmbedded) {
		searchTerms['updatedByUser'] = {
			label: 'Updated By',
			type: 'relation',
			relations: getUserFilters(true)
		}
	}
	searchTerms['createdAt'] = {
		label: 'Created At',
		type: 'date',
		addTime: true
	}
	if (!isEmbedded) {
		searchTerms['createdByUser'] = {
			label: 'Created By',
			type: 'relation',
			relations: getUserFilters(true)
		}
	}
	if (!isEmbedded) {
		searchTerms['permissions'] = {
			label: 'Permissions',
			type: 'relation',
			relationIsMany: true,
			relations: getPermissionFilters()
		}
		searchTerms['sessions'] = {
			label: 'Sessions',
			type: 'relation',
			relationIsMany: true,
			relations: getSessionFilters(true)
		}
	}
	return searchTerms
}

export const getPermissionFilters = () => {
	const searchTerms = {} as SearchTermsType
	searchTerms['permissionType'] = {
		label: 'Permission Type',
		type: 'select',
		loadMoreUrl: '/_api/autocomplete/permissions'
	}
	searchTerms['app'] = {
		label: 'App',
		type: 'select',
		options: [
			{ label: 'BILLING', value: 'BILLING' },
			{ label: 'ACCOUNTING', value: 'ACCOUNTING' },
			{ label: 'CALL TRACK', value: 'CALLTRACK' },
			{ label: 'WHOLESALE', value: 'WHOLESALE' },
			{ label: 'MANAGEMENT', value: 'MANAGEMENT' }
		]
	}
	searchTerms['isEmpty'] = {
		label: 'Is Empty',
		type: 'boolean'
	}
	searchTerms['isNotEmpty'] = {
		label: 'Is Not Empty',
		type: 'boolean'
	}
	return searchTerms
}

export const getSessionFilters = (isEmbedded: boolean = false) => {
	const searchTerms = {} as SearchTermsType
	searchTerms['quickSearch'] = {
		label: 'Quick Search',
		type: 'quickSearch',
		placeholder: 'Search by Staff Name, IP Address, City, Country or Postal Code',
		filters: [
			{
				field: 'user',
				relationIsMany: false,
				relationField: 'fullName'
			},
			{
				field: 'fingerprint'
			},
			{
				field: 'city'
			},
			{
				field: 'country'
			},
			{
				field: 'postal'
			}
		]
	}
	if (!isEmbedded) {
		searchTerms['user'] = {
			label: 'User',
			type: 'relation',
			relations: getUserFilters(true)
		}
	} else {
		searchTerms['userID'] = {
			label: 'User',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/users'
		}
	}
	searchTerms['createdAt'] = {
		label: 'Created At',
		type: 'datetime',
		addTime: true
	}
	searchTerms['expiresAt'] = {
		label: 'Expires At',
		type: 'datetime',
		addTime: true
	}
	searchTerms['fingerprint'] = {
		label: 'IP Address',
		type: 'string'
	}
	searchTerms['city'] = {
		label: 'City',
		type: 'string'
	}
	searchTerms['country'] = {
		label: 'Country',
		type: 'string'
	}
	searchTerms['postal'] = {
		label: 'Postal Code',
		type: 'string'
	}
	if (isEmbedded) {
		searchTerms['isEmpty'] = {
			label: 'Is Empty',
			type: 'boolean'
		}
		searchTerms['isNotEmpty'] = {
			label: 'Is Not Empty',
			type: 'boolean'
		}
	}
	return searchTerms
}

const getNoteFilters = () => {
	const searchTerms = {} as SearchTermsType
	searchTerms['details'] = {
		label: 'Details',
		type: 'string'
	}
	searchTerms['userID'] = {
		label: 'Created By',
		type: 'select',
		isEnum: true,
		loadMoreUrl: '/_api/autocomplete/users'
	}
	searchTerms['createdAt'] = {
		label: 'Created At',
		type: 'date',
		addTime: true
	}
	searchTerms['updatedAt'] = {
		label: 'Updated At',
		type: 'date',
		addTime: true
	}
	searchTerms['isEmpty'] = {
		label: 'Is Empty',
		type: 'boolean'
	}
	searchTerms['isNotEmpty'] = {
		label: 'Is Not Empty',
		type: 'boolean'
	}
	return searchTerms
}

export const getServiceFilters = (isEmbedded: boolean = false) => {
	const searchTerms = {} as SearchTermsType
	searchTerms['quickSearch'] = {
		label: 'Quick Search',
		type: 'quickSearch',
		placeholder: 'Search by MAC ID or Account No.',
		filters: [
			{
				field: 'macID',
				relationIsMany: isEmbedded
			},
			{
				field: 'accountNumber',
				relationIsMany: isEmbedded
			}
		]
	}
	searchTerms['id'] = {
		isHidden: !isEmbedded,
		label: 'Quick Select',
		type: 'select',
		isEnum: true,
		loadMoreUrl: '/_api/autocomplete/services'
	}
	searchTerms['macID'] = {
		label: 'MAC ID',
		type: 'string'
	}
	searchTerms['accountNumber'] = {
		label: 'Account No.',
		type: 'string'
	}
	if (isEmbedded) {
		searchTerms['customerID'] = {
			label: 'Customer',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/customers'
		}
		searchTerms['serviceTypeID'] = {
			label: 'Service Type',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/serviceTypes'
		}
		searchTerms['serviceTypeUrlID'] = {
			label: 'Service Type URL',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/serviceTypeUrls'
		}
		searchTerms['productTypeID'] = {
			label: 'Product Type',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/productTypes'
		}
	}
	if (!isEmbedded) {
		searchTerms['customer'] = {
			label: 'Customer',
			type: 'relation',
			relations: getCustomerFilters(true)
		}
		searchTerms['serviceType'] = {
			label: 'Service Type',
			type: 'relation',
			relations: getServiceTypeFilters(true)
		}
		searchTerms['serviceTypeUrl'] = {
			label: 'Service Type URL',
			type: 'relation',
			relations: getServiceTypeUrlFilters(true)
		}
		searchTerms['productType'] = {
			label: 'Product Type',
			type: 'relation',
			relations: getProductTypeFilters(true)
		}
	}
	searchTerms['createdDate'] = {
		label: 'Created Date',
		type: 'date'
	}
	searchTerms['credits'] = {
		label: 'Credits',
		type: 'number'
	}
	searchTerms['expiryDate'] = {
		label: 'Expiry Date',
		type: 'date'
	}
	searchTerms['putOnHold'] = {
		label: 'Put On Hold',
		type: 'boolean'
	}
	searchTerms['onHoldDate'] = {
		label: 'On Hold Date',
		type: 'date'
	}
	searchTerms['inactive'] = {
		label: 'Is Inactive',
		type: 'boolean'
	}
	searchTerms['isMonthly'] = {
		label: 'Is Monthly',
		type: 'boolean'
	}
	searchTerms['isFromCall'] = {
		label: 'Is From Call',
		type: 'boolean'
	}
	searchTerms['isSwitched'] = {
		label: 'Is Switched',
		type: 'boolean'
	}
	searchTerms['isTrial'] = {
		label: 'Is Trial',
		type: 'boolean'
	}
	searchTerms['isFromCall'] = {
		label: 'Is From Call',
		type: 'boolean'
	}
	if (!isEmbedded) {
		searchTerms['transactions'] = {
			label: 'Transactions',
			type: 'relation',
			relationIsMany: true,
			relations: getTransactionFilters(true)
		}
		searchTerms['notes'] = {
			label: 'Notes',
			type: 'relation',
			relationIsMany: true,
			relations: getNoteFilters()
		}
	}
	searchTerms['lastTopupAt'] = {
		label: 'Last Topup At',
		type: 'date',
		addTime: true
	}
	searchTerms['updatedAt'] = {
		label: 'Updated At',
		type: 'date',
		addTime: true
	}
	if (isEmbedded) {
		searchTerms['updatedBy'] = {
			label: 'Updated By',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/users'
		}
	} else {
		searchTerms['updatedByUser'] = {
			label: 'Updated By',
			type: 'relation',
			relations: getUserFilters(true)
		}
	}
	searchTerms['createdAt'] = {
		label: 'Created At',
		type: 'date',
		addTime: true
	}
	if (isEmbedded) {
		searchTerms['createdBy'] = {
			label: 'Created By',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/users'
		}
	} else {
		searchTerms['createdByUser'] = {
			label: 'Created By',
			type: 'relation',
			relations: getUserFilters(true)
		}
	}
	if (isEmbedded) {
		searchTerms['isEmpty'] = {
			label: 'Is Empty',
			type: 'boolean'
		}
		searchTerms['isNotEmpty'] = {
			label: 'Is Not Empty',
			type: 'boolean'
		}
	}
	return searchTerms
}

export const getServiceTypeFilters = (isEmbedded: boolean = false) => {
	const searchTerms = {} as SearchTermsType
	searchTerms['id'] = {
		isHidden: !isEmbedded,
		label: 'Quick Select',
		type: 'select',
		isEnum: true,
		loadMoreUrl: '/_api/autocomplete/serviceTypes'
	}
	searchTerms['quickSearch'] = {
		label: 'Quick Search',
		type: 'quickSearch',
		placeholder: 'Search by Name or Details',
		filters: [
			{
				field: 'name'
			},
			{
				field: 'details'
			}
		]
	}
	searchTerms['name'] = {
		label: 'Name',
		type: 'string'
	}
	searchTerms['details'] = {
		label: 'Details',
		type: 'string'
	}
	searchTerms['order'] = {
		label: 'Order',
		type: 'number'
	}
	searchTerms['topupDueDays'] = {
		label: 'Topup Due Days',
		type: 'number'
	}
	searchTerms['reminderDays'] = {
		label: 'Reminder Days',
		type: 'number'
	}
	searchTerms['updatedAt'] = {
		label: 'Updated At',
		type: 'date',
		addTime: true
	}
	searchTerms['createdAt'] = {
		label: 'Created At',
		type: 'date',
		addTime: true
	}
	if (!isEmbedded) {
		searchTerms['serviceTypeUrls'] = {
			label: 'Service Type Urls',
			type: 'relation',
			relationIsMany: true,
			relations: getServiceTypeUrlFilters(true)
		}
		searchTerms['services'] = {
			label: 'Services',
			type: 'relation',
			relationIsMany: true,
			relations: getServiceFilters(true)
		}
		searchTerms['transactions'] = {
			label: 'Transactions',
			type: 'relation',
			relationIsMany: true,
			relations: getTransactionFilters(true)
		}
		searchTerms['callRecords'] = {
			label: 'Call Records',
			type: 'relation',
			relationIsMany: true,
			relations: getCallRecordFilters(true)
		}
	}
	if (isEmbedded) {
		searchTerms['isEmpty'] = {
			label: 'Is Empty',
			type: 'boolean'
		}
		searchTerms['isNotEmpty'] = {
			label: 'Is Not Empty',
			type: 'boolean'
		}
	}
	return searchTerms
}

export const getServiceTypeUrlFilters = (isEmbedded: boolean = false) => {
	const searchTerms = {} as SearchTermsType
	searchTerms['id'] = {
		isHidden: !isEmbedded,
		label: 'Quick Select',
		type: 'select',
		isEnum: true,
		loadMoreUrl: '/_api/autocomplete/serviceTypeUrls'
	}
	searchTerms['quickSearch'] = {
		label: 'Quick Search',
		type: 'quickSearch',
		placeholder: 'Search by Name or Url',
		filters: [
			{
				field: 'urlName'
			},
			{
				field: 'url'
			}
		]
	}
	searchTerms['urlName'] = {
		label: 'Name',
		type: 'string'
	}
	searchTerms['url'] = {
		label: 'URL',
		type: 'string'
	}
	if (isEmbedded) {
		searchTerms['serviceTypeID'] = {
			label: 'Service Type',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/serviceTypes'
		}
	} else {
		searchTerms['serviceType'] = {
			label: 'Service Type',
			type: 'relation',
			relations: getServiceTypeFilters(true)
		}
	}
	if (!isEmbedded) {
		searchTerms['services'] = {
			label: 'Services',
			type: 'relation',
			relationIsMany: true,
			relations: getServiceFilters(true)
		}
	}
	searchTerms['updatedAt'] = {
		label: 'Updated At',
		type: 'date',
		addTime: true
	}
	searchTerms['createdAt'] = {
		label: 'Created At',
		type: 'date',
		addTime: true
	}
	if (isEmbedded) {
		searchTerms['isEmpty'] = {
			label: 'Is Empty',
			type: 'boolean'
		}
		searchTerms['isNotEmpty'] = {
			label: 'Is Not Empty',
			type: 'boolean'
		}
	}
	return searchTerms
}

export const getProductTypeFilters = (isEmbedded: boolean = false) => {
	if (isEmbedded) {
		return getNameDetailsFilters('/_api/autocomplete/productTypes', isEmbedded)
	} else {
		return {
			...getNameDetailsFilters('/_api/autocomplete/productTypes', isEmbedded),
			services: {
				label: 'Services',
				type: 'relation',
				relationIsMany: true,
				relations: getServiceFilters(true)
			},
			callRecords: {
				label: 'Call Records',
				type: 'relation',
				relationIsMany: true,
				relations: getCallRecordFilters(true)
			},
			products: {
				label: 'Products',
				type: 'relation',
				relationIsMany: true,
				relations: getProductFilters(true)
			}
		}
	}
}

export const getTransactionFilters = (isEmbedded: boolean = false) => {
	const searchTerms = {} as SearchTermsType
	searchTerms['quickSearch'] = {
		label: 'Quick Search',
		type: 'quickSearch',
		placeholder: 'Search by Number or Notes',
		filters: [
			{
				field: 'transactionNumber',
				relationIsMany: isEmbedded
			},
			{
				field: 'notes',
				relationIsMany: true,
				relationField: 'details'
			}
		]
	}
	searchTerms['transactionNumber'] = {
		label: 'Transaction Number',
		type: 'string'
	}
	searchTerms['transactionType'] = {
		label: 'Transaction Type',
		type: 'select',
		isEnum: true,
		loadMoreUrl: '/_api/autocomplete/billingTransactionTypes'
	}
	searchTerms['date'] = {
		label: 'Created Date',
		type: 'date'
	}
	searchTerms['credits'] = {
		label: 'Credits',
		type: 'number'
	}
	if (isEmbedded) {
		searchTerms['customerID'] = {
			label: 'Customer',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/customers'
		}
		searchTerms['serviceID'] = {
			label: 'Service',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/services'
		}
		searchTerms['serviceTypeID'] = {
			label: 'Service Type',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/serviceTypes'
		}
		searchTerms['shipmentID'] = {
			label: 'Shipment',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/shipments'
		}
		searchTerms['handledBy'] = {
			label: 'Handled By',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/users'
		}
	} else {
		searchTerms['customer'] = {
			label: 'Customer',
			type: 'relation',
			relations: getCustomerFilters(true)
		}
		searchTerms['service'] = {
			label: 'Service',
			type: 'relation',
			relations: getServiceFilters(true)
		}
		searchTerms['serviceType'] = {
			label: 'Service Type',
			type: 'relation',
			relations: getServiceTypeFilters(true)
		}
		searchTerms['shipment'] = {
			label: 'Shipment',
			type: 'relation',
			relations: getShipmentFilters(true)
		}
		searchTerms['handledByUser'] = {
			label: 'Handled By',
			type: 'relation',
			relations: getUserFilters(true)
		}
	}
	searchTerms['isFromCall'] = {
		label: 'Is From Call',
		type: 'boolean'
	}
	if (!isEmbedded) {
		searchTerms['notes'] = {
			label: 'Notes',
			type: 'relation',
			relationIsMany: true,
			relations: getNoteFilters()
		}
	}
	searchTerms['updatedAt'] = {
		label: 'Updated At',
		type: 'date',
		addTime: true
	}
	if (isEmbedded) {
		searchTerms['updatedBy'] = {
			label: 'Updated By',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/users'
		}
	} else {
		searchTerms['updatedByUser'] = {
			label: 'Updated By',
			type: 'relation',
			relations: getUserFilters(true)
		}
	}
	searchTerms['createdAt'] = {
		label: 'Created At',
		type: 'date',
		addTime: true
	}
	if (isEmbedded) {
		searchTerms['createdBy'] = {
			label: 'Created By',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/users'
		}
	} else {
		searchTerms['createdByUser'] = {
			label: 'Created By',
			type: 'relation',
			relations: getUserFilters(true)
		}
	}
	if (isEmbedded) {
		searchTerms['isEmpty'] = {
			label: 'Is Empty',
			type: 'boolean'
		}
		searchTerms['isNotEmpty'] = {
			label: 'Is Not Empty',
			type: 'boolean'
		}
	}
	return searchTerms
}

export const getShipmentFilters = (isEmbedded: boolean = false) => {
	return {
		...getNameDetailsFilters('/_api/autocomplete/shipments', isEmbedded),
		transactions: {
			label: 'Transactions',
			type: 'relation',
			relationIsMany: true,
			relations: getTransactionFilters(true)
		}
	}
}

export const getTicketFilters = (isEmbedded: boolean = false) => {
	const searchTerms = {} as SearchTermsType
	searchTerms['quickSearch'] = {
		label: 'Notes',
		type: 'quickSearch',
		placeholder: 'Search by Notes',
		filters: [
			{
				field: 'notes',
				relationIsMany: true,
				relationField: 'details'
			}
		]
	}
	if (isEmbedded) {
		searchTerms['subjectID'] = {
			label: 'Subject',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/ticketSubjects'
		}
	} else {
		searchTerms['subject'] = {
			label: 'Subject',
			type: 'relation',
			relations: getTicketSubjectFilters(true)
		}
	}
	searchTerms['expiresAt'] = {
		label: 'Expires At',
		type: 'date'
	}
	if (isEmbedded) {
		searchTerms['assignedTo'] = {
			label: 'Assigned To',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/users'
		}
		searchTerms['assignedBy'] = {
			label: 'Assigned By',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/users'
		}
	} else {
		searchTerms['assignedToUser'] = {
			label: 'Assigned To',
			type: 'relation',
			relations: getUserFilters(true)
		}
		searchTerms['assignedByUser'] = {
			label: 'Assigned By',
			type: 'relation',
			relations: getUserFilters(true)
		}
	}
	if (!isEmbedded) {
		searchTerms['customer'] = {
			label: 'Customer',
			type: 'relation',
			relations: getCustomerFilters(true)
		}
		searchTerms['dailyReportLog'] = {
			label: 'Daily Report Log',
			type: 'relation',
			relations: getDailyReportLogFilters(true)
		}
	} else {
		searchTerms['customerID'] = {
			label: 'Customer',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/customers'
		}
		searchTerms['dailyReportLogID'] = {
			label: 'Daily Report Log',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/dailyReportLogs'
		}
	}
	if (!isEmbedded) {
		searchTerms['notes'] = {
			label: 'Notes',
			type: 'relation',
			relationIsMany: true,
			relations: getNoteFilters()
		}
	}
	searchTerms['updatedAt'] = {
		label: 'Updated At',
		type: 'date',
		addTime: true
	}
	if (isEmbedded) {
		searchTerms['updatedBy'] = {
			label: 'Updated By',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/users'
		}
	} else {
		searchTerms['updatedByUser'] = {
			label: 'Updated By',
			type: 'relation',
			relations: getUserFilters(true)
		}
	}
	searchTerms['createdAt'] = {
		label: 'Created At',
		type: 'date',
		addTime: true
	}
	if (isEmbedded) {
		searchTerms['createdBy'] = {
			label: 'Created By',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/users'
		}
	} else {
		searchTerms['createdByUser'] = {
			label: 'Created By',
			type: 'relation',
			relations: getUserFilters(true)
		}
	}
	if (isEmbedded) {
		searchTerms['isEmpty'] = {
			label: 'Is Empty',
			type: 'boolean'
		}
		searchTerms['isNotEmpty'] = {
			label: 'Is Not Empty',
			type: 'boolean'
		}
	}
	return searchTerms
}

export const getTicketSubjectFilters = (isEmbedded: boolean = false) => {
	if (isEmbedded) {
		return getNameDetailsFilters('/_api/autocomplete/ticketSubjects', isEmbedded)
	} else {
		return {
			...getNameDetailsFilters('/_api/autocomplete/ticketSubjects', isEmbedded),
			tickets: {
				label: 'Tickets',
				type: 'relation',
				relationIsMany: true,
				relations: getTicketFilters(true)
			}
		}
	}
}

export const getDailyReportLogFilters = (isEmbedded: boolean = false) => {
	const searchTerms = {} as SearchTermsType
	searchTerms['quickSearch'] = {
		label: 'Quick Search',
		type: 'quickSearch',
		placeholder: 'Search by Number',
		filters: [
			{
				field: 'transactionNo'
			},
			{
				field: 'refundReceiptNo'
			},
			{
				field: 'receivingPaymentNo'
			}
		]
	}
	if (isEmbedded) {
		searchTerms['id'] = {
			label: 'Quick Select',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/dailyReportLogs'
		}
	} else {
		searchTerms['id'] = {
			label: 'ID',
			type: 'string'
		}
	}
	searchTerms['processedDate'] = {
		label: 'Processed Date',
		type: 'date'
	}
	searchTerms['transactionNo'] = {
		label: 'Transaction Number',
		type: 'string'
	}
	searchTerms['refundReceiptNo'] = {
		label: 'Refund Receipt Number',
		type: 'string'
	}
	searchTerms['receivingPaymentNo'] = {
		label: 'Receiving Payment Number',
		type: 'string'
	}
	searchTerms['totalAmount'] = {
		label: 'Total Amount',
		type: 'number'
	}
	searchTerms['needVerification'] = {
		label: 'Needs Verification',
		type: 'boolean'
	}
	if (!isEmbedded) {
		searchTerms['verifications'] = {
			label: 'Verifications',
			type: 'relation',
			relationIsMany: true,
			relations: {
				userID: {
					label: 'Staff',
					type: 'select',
					isEnum: true,
					loadMoreUrl: '/_api/autocomplete/users'
				}
			}
		}
	}
	if (isEmbedded) {
		searchTerms['salesPersonID'] = {
			label: 'Sales Person',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/users'
		}
		searchTerms['companyID'] = {
			label: 'Company',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/companies'
		}
	} else {
		searchTerms['salesPerson'] = {
			label: 'Sales Person',
			type: 'relation',
			relations: getUserFilters(true)
		}
		searchTerms['company'] = {
			label: 'Company',
			type: 'relation',
			relations: getCompanyFilters(true)
		}
	}
	searchTerms['payments'] = {
		label: 'Payments',
		type: 'relation',
		relationIsMany: true,
		relations: getPaymentFilters(true)
	}
	searchTerms['tickets'] = {
		label: 'Tickets',
		type: 'relation',
		relationIsMany: true,
		relations: getTicketFilters(true)
	}
	if (!isEmbedded) {
		searchTerms['notes'] = {
			label: 'Notes',
			type: 'relation',
			relationIsMany: true,
			relations: getNoteFilters()
		}
		searchTerms['payments'] = {
			label: 'Payments',
			type: 'relation',
			relationIsMany: true,
			relations: getPaymentFilters(true)
		}
		searchTerms['tickets'] = {
			label: 'Tickets',
			type: 'relation',
			relationIsMany: true,
			relations: getTicketFilters(true)
		}
	}
	searchTerms['updatedAt'] = {
		label: 'Updated At',
		type: 'date',
		addTime: true
	}
	if (isEmbedded) {
		searchTerms['updatedBy'] = {
			label: 'Updated By',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/users'
		}
	} else {
		searchTerms['updatedByUser'] = {
			label: 'Updated By Staff',
			type: 'relation',
			relations: getUserFilters(true)
		}
	}
	searchTerms['createdAt'] = {
		label: 'Created At',
		type: 'date',
		addTime: true
	}
	if (isEmbedded) {
		searchTerms['createdBy'] = {
			label: 'Created By',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/users'
		}
	} else {
		searchTerms['createdByUser'] = {
			label: 'Created By Staff',
			type: 'relation',
			relations: getUserFilters(true)
		}
	}
	return searchTerms
}

export const getCompanyFilters = (isEmbedded: boolean = false) => {
	if (isEmbedded) {
		return getNameDetailsFilters('/_api/autocomplete/companies', isEmbedded)
	} else {
		return {
			...getNameDetailsFilters('/_api/autocomplete/companies', isEmbedded),
			dailyReportLogs: {
				label: 'Daily Report Logs',
				type: 'relation',
				relationIsMany: true,
				relations: getDailyReportLogFilters(true)
			}
		}
	}
}

export const getPaymentFilters = (isEmbedded: boolean = false) => {
	const searchTerms = {} as SearchTermsType
	searchTerms['quickSearch'] = {
		label: 'Quick Search',
		type: 'quickSearch',
		placeholder: 'Search by Authorization Code or Details',
		filters: [
			{
				field: 'authorizationCode',
				relationIsMany: true
			},
			{
				field: 'details',
				relationIsMany: true
			}
		]
	}
	searchTerms['amount'] = {
		label: 'Amount',
		type: 'number'
	}
	searchTerms['authorizationCode'] = {
		label: 'Authorization Code',
		type: 'string'
	}
	searchTerms['details'] = {
		label: 'Details',
		type: 'string'
	}
	if (isEmbedded) {
		searchTerms['dailyReportLogID'] = {
			label: 'Daily Report Log',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/dailyReportLogs'
		}
		searchTerms['paymentMethodID'] = {
			label: 'Payment Method',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/paymentMethods'
		}
		searchTerms['terminalID'] = {
			label: 'Terminal',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/terminals'
		}
		searchTerms['companyID'] = {
			label: 'Company',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/companies'
		}
	} else {
		searchTerms['dailyReportLog'] = {
			label: 'Daily Report Log',
			type: 'relation',
			relations: getDailyReportLogFilters(true)
		}
		searchTerms['paymentMethod'] = {
			label: 'Payment Method',
			type: 'relation',
			relations: getPaymentMethodFilters(true)
		}
		searchTerms['terminal'] = {
			label: 'Terminal',
			type: 'relation',
			relations: getTerminalFilters(true)
		}
		searchTerms['company'] = {
			label: 'Company',
			type: 'relation',
			relations: getCompanyFilters(true)
		}
	}
	searchTerms['updatedAt'] = {
		label: 'Updated At',
		type: 'date',
		addTime: true
	}
	if (isEmbedded) {
		searchTerms['updatedBy'] = {
			label: 'Updated By',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/users'
		}
	} else {
		searchTerms['updatedByUser'] = {
			label: 'Updated By',
			type: 'relation',
			relations: getUserFilters(true)
		}
	}
	searchTerms['createdAt'] = {
		label: 'Created At',
		type: 'date',
		addTime: true
	}
	if (isEmbedded) {
		searchTerms['createdBy'] = {
			label: 'Created By',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/users'
		}
	} else {
		searchTerms['createdByUser'] = {
			label: 'Created By',
			type: 'relation',
			relations: getUserFilters(true)
		}
	}
	return searchTerms
}

export const getPaymentMethodFilters = (isEmbedded: boolean = false) => {
	const searchTerms = {} as SearchTermsType
	searchTerms['id'] = {
		isHidden: !isEmbedded,
		label: 'Quick Select',
		type: 'select',
		isEnum: true,
		loadMoreUrl: '/_api/autocomplete/paymentMethods'
	}
	searchTerms['quickSearch'] = {
		label: 'Quick Search',
		type: 'quickSearch',
		placeholder: 'Search by Name or Details',
		filters: [
			{
				field: 'name'
			},
			{
				field: 'details'
			}
		]
	}
	searchTerms['name'] = {
		label: 'Name',
		type: 'string'
	}
	searchTerms['details'] = {
		label: 'Details',
		type: 'string'
	}
	searchTerms['isCard'] = {
		label: 'Is Card',
		type: 'boolean'
	}
	searchTerms['updatedAt'] = {
		label: 'Updated At',
		type: 'date',
		addTime: true
	}
	searchTerms['createdAt'] = {
		label: 'Created At',
		type: 'date',
		addTime: true
	}
	if (isEmbedded) {
		searchTerms['isEmpty'] = {
			label: 'Is Empty',
			type: 'boolean'
		}
		searchTerms['isNotEmpty'] = {
			label: 'Is Not Empty',
			type: 'boolean'
		}
	}
	return searchTerms
}

export const getTerminalFilters = (isEmbedded: boolean = false) => {
	if (isEmbedded) {
		return getNameDetailsFilters('/_api/autocomplete/terminals', isEmbedded)
	} else {
		return {
			...getNameDetailsFilters('/_api/autocomplete/terminals', isEmbedded),
			payments: {
				label: 'Payments',
				type: 'relation',
				relationIsMany: true,
				relations: getPaymentMethodFilters(true)
			}
		}
	}
}

export const getProductFilters = (isEmbedded: boolean = false) => {
	const searchTerms = {} as SearchTermsType
	searchTerms['quickSearch'] = {
		label: 'Quick Search',
		type: 'quickSearch',
		placeholder: 'Search by Serial No. or MAC ID',
		filters: [
			{
				field: 'serialNo'
			},
			{
				field: 'macID'
			}
		]
	}
	searchTerms['id'] = {
		isHidden: !isEmbedded,
		label: 'Quick Select',
		type: 'select',
		isEnum: true,
		loadMoreUrl: '/_api/autocomplete/products'
	}
	searchTerms['serialNo'] = {
		label: 'Serial No.',
		type: 'string'
	}
	searchTerms['macID'] = {
		label: 'MAC ID',
		type: 'string'
	}
	if (isEmbedded) {
		searchTerms['productTypeID'] = {
			label: 'Product Type',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/productTypes'
		}
		searchTerms['vendorID'] = {
			label: 'Vendor',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/vendors'
		}
		searchTerms['resellerID'] = {
			label: 'Reseller',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/resellers'
		}
	} else {
		searchTerms['productType'] = {
			label: 'Product Type',
			type: 'relation',
			relations: getProductTypeFilters(true)
		}
		searchTerms['vendor'] = {
			label: 'Vendor',
			type: 'relation',
			relations: getVendorFilters(true)
		}
		searchTerms['reseller'] = {
			label: 'Reseller',
			type: 'relation',
			relations: getResellerFilters(true)
		}
	}
	searchTerms['vendorInvoiceNo'] = {
		label: 'Vendor Invoice No.',
		type: 'string'
	}
	searchTerms['vendorPurchaseDt'] = {
		label: 'Vendor Purchase Date',
		type: 'date'
	}
	searchTerms['vendorWarrantyExpiryDt'] = {
		label: 'Vendor Warranty Expiry Date',
		type: 'date'
	}
	searchTerms['resellerInvoiceNo'] = {
		label: 'Reseller Invoice No.',
		type: 'string'
	}
	searchTerms['resellerPurchaseDt'] = {
		label: 'Reseller Purchase Date',
		type: 'date'
	}
	searchTerms['resellerWarrantyExpiryDt'] = {
		label: 'Reseller Warranty Expiry Date',
		type: 'date'
	}
	if (!isEmbedded) {
		searchTerms['warrantyClaims'] = {
			label: 'Warranty Claims',
			type: 'relation',
			relationIsMany: true,
			relations: getWarrantyClaimFilters(true)
		}
		searchTerms['notes'] = {
			label: 'Notes',
			type: 'relation',
			relationIsMany: true,
			relations: getNoteFilters()
		}
	}
	searchTerms['createdAt'] = {
		label: 'Created At',
		type: 'date',
		addTime: true
	}
	if (isEmbedded) {
		searchTerms['createdBy'] = {
			label: 'Created By',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/users'
		}
	} else {
		searchTerms['createdByUser'] = {
			label: 'Created By',
			type: 'relation',
			relations: getUserFilters(true)
		}
	}
	searchTerms['updatedAt'] = {
		label: 'Updated At',
		type: 'date',
		addTime: true
	}
	if (isEmbedded) {
		searchTerms['updatedBy'] = {
			label: 'Updated By',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/users'
		}
	} else {
		searchTerms['updatedByUser'] = {
			label: 'Updated By',
			type: 'relation',
			relations: getUserFilters(true)
		}
	}
	return searchTerms
}

const getWholesalerFilters = (loadMoreUrl: string, isEmbedded: boolean = false) => {
	const searchTerms = {} as SearchTermsType
	searchTerms['quickSearch'] = {
		label: 'Quick Search',
		type: 'quickSearch',
		placeholder: 'Search by Name or Email or Phone No.',
		filters: [
			{
				field: 'name'
			},
			{
				field: 'email'
			},
			{
				field: 'phoneNo'
			}
		]
	}
	searchTerms['id'] = {
		isHidden: !isEmbedded,
		label: 'Quick Select',
		type: 'select',
		isEnum: true,
		loadMoreUrl
	}
	searchTerms['name'] = {
		label: 'Name',
		type: 'string'
	}
	searchTerms['email'] = {
		label: 'Email',
		type: 'string'
	}
	searchTerms['phoneNo'] = {
		label: 'Phone No.',
		type: 'string'
	}
	searchTerms['details'] = {
		label: 'Details',
		type: 'string'
	}
	searchTerms['address'] = {
		label: 'Address',
		type: 'string'
	}
	if (!isEmbedded) {
		searchTerms['products'] = {
			label: 'Products',
			type: 'relation',
			relationIsMany: true,
			relations: getProductFilters(true)
		}
	}
	searchTerms['createdAt'] = {
		label: 'Created At',
		type: 'date',
		addTime: true
	}
	if (isEmbedded) {
		searchTerms['createdBy'] = {
			label: 'Created By',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/users'
		}
	} else {
		searchTerms['createdByUser'] = {
			label: 'Created By',
			type: 'relation',
			relations: getUserFilters(true)
		}
	}
	searchTerms['updatedAt'] = {
		label: 'Updated At',
		type: 'date',
		addTime: true
	}
	if (isEmbedded) {
		searchTerms['updatedBy'] = {
			label: 'Updated By',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/users'
		}
	} else {
		searchTerms['updatedByUser'] = {
			label: 'Updated By',
			type: 'relation',
			relations: getUserFilters(true)
		}
	}
	if (isEmbedded) {
		searchTerms['isEmpty'] = {
			label: 'Is Empty',
			type: 'boolean'
		}
		searchTerms['isNotEmpty'] = {
			label: 'Is Not Empty',
			type: 'boolean'
		}
	}
	return searchTerms
}

export const getVendorFilters = (isEmbedded: boolean = false) => {
	return getWholesalerFilters('/_api/autocomplete/vendors', isEmbedded)
}

export const getResellerFilters = (isEmbedded: boolean = false) => {
	return getWholesalerFilters('/_api/autocomplete/resellers', isEmbedded)
}

export const getWarrantyClaimFilters = (isEmbedded: boolean = false) => {
	const searchTerms = {} as SearchTermsType
	searchTerms['quickSearch'] = {
		label: 'Quick Search',
		type: 'quickSearch',
		placeholder: 'Search by Notes',
		filters: [
			{
				field: 'notes',
				relationIsMany: true,
				relationField: 'details'
			}
		]
	}
	if (isEmbedded) {
		searchTerms['status'] = {
			label: 'Status',
			type: 'select',
			isEnum: true,
			options: [
				{ label: 'Pending', value: 'PENDING' },
				{ label: 'Approved', value: 'APPROVED' },
				{ label: 'Denied', value: 'DENIED' }
			]
		}
	}
	searchTerms['returnedDate'] = {
		label: 'Returned Date',
		type: 'date'
	}
	if (isEmbedded) {
		searchTerms['productID'] = {
			label: 'Product',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/products'
		}
	} else {
		searchTerms['product'] = {
			label: 'Product',
			type: 'relation',
			relations: getProductFilters(true)
		}
	}
	if (!isEmbedded) {
		searchTerms['notes'] = {
			label: 'Notes',
			type: 'relation',
			relationIsMany: true,
			relations: getNoteFilters()
		}
	}
	searchTerms['createdAt'] = {
		label: 'Created At',
		type: 'date',
		addTime: true
	}
	if (isEmbedded) {
		searchTerms['createdBy'] = {
			label: 'Created By',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/users'
		}
	} else {
		searchTerms['createdByUser'] = {
			label: 'Created By',
			type: 'relation',
			relations: getUserFilters(true)
		}
	}
	searchTerms['updatedAt'] = {
		label: 'Updated At',
		type: 'date',
		addTime: true
	}
	if (isEmbedded) {
		searchTerms['updatedBy'] = {
			label: 'Updated By',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/users'
		}
	} else {
		searchTerms['updatedByUser'] = {
			label: 'Updated By',
			type: 'relation',
			relations: getUserFilters(true)
		}
	}
	if (isEmbedded) {
		searchTerms['isEmpty'] = {
			label: 'Is Empty',
			type: 'boolean'
		}
		searchTerms['isNotEmpty'] = {
			label: 'Is Not Empty',
			type: 'boolean'
		}
	}
	return searchTerms
}

export const getCallRecordFilters = (isEmbedded: boolean = false) => {
	const searchTerms = {} as SearchTermsType
	searchTerms['quickSearch'] = {
		label: 'Quick Search',
		type: 'quickSearch',
		placeholder: 'Search by Customer Phone No, StorePhone Name or Phone No.',
		filters: [
			{
				field: 'customerPhoneNo',
				type: 'string',
				relationIsMany: isEmbedded
			},
			{
				field: 'storePhoneNumber',
				relationIsMany: false,
				relationField: 'name'
			},
			{
				field: 'storePhoneNumber',
				relationIsMany: false,
				relationField: 'phoneNo'
			}
		]
	}
	searchTerms['startTimeDate'] = {
		field: 'startTime',
		label: 'Start Date',
		type: 'date',
		addTime: true
	}
	searchTerms['startTime'] = {
		label: 'Start Time',
		type: 'datetime'
	}
	searchTerms['endTimeDate'] = {
		field: 'endTime',
		label: 'End Date',
		type: 'date',
		addTime: true
	}
	searchTerms['endTime'] = {
		label: 'End Time',
		type: 'datetime'
	}
	searchTerms['duration'] = {
		label: 'Duration',
		placeholder: 'Duration (in seconds)',
		type: 'number'
	}
	searchTerms['customerWaitSeconds'] = {
		label: 'Wait Time',
		type: 'number'
	}
	searchTerms['callType'] = {
		label: 'Call Type',
		type: 'select',
		isEnum: true,
		loadMoreUrl: '/_api/autocomplete/callTypes'
	}
	searchTerms['customerPhoneNo'] = {
		label: 'Customer Phone No',
		type: 'string'
	}
	searchTerms['isNewCustomer'] = {
		label: 'Is New Customer',
		type: 'boolean'
	}
	if (isEmbedded) {
		searchTerms['callCategoryLevelOneID'] = {
			label: 'Call Category Level One',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/callCategoriesLevelOne'
		}
		searchTerms['callCategoryLevelTwoID'] = {
			label: 'Call Category Level Two',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/callCategoriesLevelTwo'
		}
		searchTerms['callCategoryLevelThreeID'] = {
			label: 'Call Category Level Three',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/callCategoriesLevelThree'
		}
		searchTerms['storePhoneNumberID'] = {
			label: 'Store Phone Number',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/storePhoneNumbers'
		}
		searchTerms['productTypeID'] = {
			label: 'Product Type',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/productTypes'
		}
		searchTerms['serviceTypeID'] = {
			label: 'Service Type',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/serviceTypes'
		}
	} else {
		searchTerms['callCategoryLevelOne'] = {
			label: 'Call Category Level One',
			type: 'relation',
			relations: getCallCategoryLevelOneFilters(true)
		}
		searchTerms['callCategoryLevelTwo'] = {
			label: 'Call Category Level Two',
			type: 'relation',
			relations: getCallCategoryLevelTwoFilters(true)
		}
		searchTerms['callCategoryLevelThree'] = {
			label: 'Call Category Level Three',
			type: 'relation',
			relations: getCallCategoryLevelThreeFilters(true)
		}
		searchTerms['storePhoneNumber'] = {
			label: 'Store Phone Number',
			type: 'relation',
			relations: getStorePhoneNumberFilters(true)
		}
		searchTerms['productType'] = {
			label: 'Product Type',
			type: 'relation',
			relations: getProductTypeFilters(true)
		}
		searchTerms['serviceType'] = {
			label: 'Service Type',
			type: 'relation',
			relations: getServiceTypeFilters(true)
		}
	}
	if (!isEmbedded) {
		searchTerms['notes'] = {
			label: 'Notes',
			type: 'relation',
			relationIsMany: true,
			relations: getNoteFilters()
		}
	}
	searchTerms['createdAt'] = {
		label: 'Created At',
		type: 'date',
		addTime: true
	}
	if (isEmbedded) {
		searchTerms['createdBy'] = {
			label: 'Created By',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/users'
		}
	} else {
		searchTerms['createdByUser'] = {
			label: 'Created By',
			type: 'relation',
			relations: getUserFilters(true)
		}
	}
	searchTerms['updatedAt'] = {
		label: 'Updated At',
		type: 'date',
		addTime: true
	}
	if (isEmbedded) {
		searchTerms['updatedBy'] = {
			label: 'Updated By',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/users'
		}
	} else {
		searchTerms['updatedByUser'] = {
			label: 'Updated By',
			type: 'relation',
			relations: getUserFilters(true)
		}
	}
	if (isEmbedded) {
		searchTerms['isEmpty'] = {
			label: 'Is Empty',
			type: 'boolean'
		}
		searchTerms['isNotEmpty'] = {
			label: 'Is Not Empty',
			type: 'boolean'
		}
	}
	return searchTerms
}

export const getCallCategoryLevelOneFilters = (isEmbedded: boolean = false) => {
	const searchTerms = {} as SearchTermsType
	searchTerms['id'] = {
		isHidden: !isEmbedded,
		label: 'Quick Select',
		type: 'select',
		isEnum: true,
		loadMoreUrl: '/_api/autocomplete/callCategoriesLevelOne'
	}
	searchTerms['quickSearch'] = {
		label: 'Quick Search',
		type: 'quickSearch',
		placeholder: 'Search by Name or Details.',
		filters: [
			{
				field: 'name'
			},
			{
				field: 'details'
			}
		]
	}
	searchTerms['name'] = {
		label: 'Name',
		type: 'string'
	}
	searchTerms['details'] = {
		label: 'Details',
		type: 'string'
	}
	if (!isEmbedded) {
		searchTerms['callCategoryLevelTwo'] = {
			label: 'Main Categories',
			type: 'relation',
			relationIsMany: true,
			relations: getCallCategoryLevelTwoFilters(true)
		}
		searchTerms['callRecords'] = {
			label: 'Call Records',
			type: 'relation',
			relationIsMany: true,
			relations: getCallRecordFilters(true)
		}
	}
	searchTerms['updatedAt'] = {
		label: 'Updated At',
		type: 'date',
		addTime: true
	}
	searchTerms['createdAt'] = {
		label: 'Created At',
		type: 'date',
		addTime: true
	}
	if (isEmbedded) {
		searchTerms['isEmpty'] = {
			label: 'Is Empty',
			type: 'boolean'
		}
		searchTerms['isNotEmpty'] = {
			label: 'Is Not Empty',
			type: 'boolean'
		}
	}
	return searchTerms
}

export const getCallCategoryLevelTwoFilters = (isEmbedded: boolean = false) => {
	const searchTerms = {} as SearchTermsType
	searchTerms['id'] = {
		isHidden: !isEmbedded,
		label: 'Quick Select',
		type: 'select',
		isEnum: true,
		loadMoreUrl: '/_api/autocomplete/callCategoriesLevelTwo'
	}
	searchTerms['quickSearch'] = {
		label: 'Quick Search',
		type: 'quickSearch',
		placeholder: 'Search by Name or Details.',
		filters: [
			{
				field: 'name'
			},
			{
				field: 'details'
			}
		]
	}
	searchTerms['name'] = {
		label: 'Name',
		type: 'string'
	}
	searchTerms['details'] = {
		label: 'Details',
		type: 'string'
	}
	if (isEmbedded) {
		searchTerms['callCategoryLevelOneID'] = {
			label: 'Service Category',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/callCategoriesLevelOne'
		}
	} else {
		searchTerms['callCategoryLevelOne'] = {
			label: 'Service Category',
			type: 'relation',
			relations: getCallCategoryLevelOneFilters(true)
		}
		searchTerms['callCategoryLevelThree'] = {
			label: 'Sub Categories',
			type: 'relation',
			relationIsMany: true,
			relations: getCallCategoryLevelThreeFilters(true)
		}
		searchTerms['callRecords'] = {
			label: 'Call Records',
			type: 'relation',
			relationIsMany: true,
			relations: getCallRecordFilters(true)
		}
	}
	searchTerms['updatedAt'] = {
		label: 'Updated At',
		type: 'date',
		addTime: true
	}
	searchTerms['createdAt'] = {
		label: 'Created At',
		type: 'date',
		addTime: true
	}
	if (isEmbedded) {
		searchTerms['isEmpty'] = {
			label: 'Is Empty',
			type: 'boolean'
		}
		searchTerms['isNotEmpty'] = {
			label: 'Is Not Empty',
			type: 'boolean'
		}
	}
	return searchTerms
}

export const getCallCategoryLevelThreeFilters = (isEmbedded: boolean = false) => {
	const searchTerms = {} as SearchTermsType
	searchTerms['id'] = {
		isHidden: !isEmbedded,
		label: 'Quick Select',
		type: 'select',
		isEnum: true,
		loadMoreUrl: '/_api/autocomplete/callCategoriesLevelThree'
	}
	searchTerms['quickSearch'] = {
		label: 'Quick Search',
		type: 'quickSearch',
		placeholder: 'Search by Name or Details.',
		filters: [
			{
				field: 'name'
			},
			{
				field: 'details'
			}
		]
	}
	searchTerms['name'] = {
		label: 'Name',
		type: 'string'
	}
	searchTerms['details'] = {
		label: 'Details',
		type: 'string'
	}
	if (isEmbedded) {
		searchTerms['callCategoryLevelTwoID'] = {
			label: 'Main Category',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/callCategoriesLevelTwo'
		}
	} else {
		searchTerms['callCategoryLevelTwo'] = {
			label: 'Main Category',
			type: 'relation',
			relations: getCallCategoryLevelTwoFilters(true)
		}
		searchTerms['callRecords'] = {
			label: 'Call Records',
			type: 'relation',
			relationIsMany: true,
			relations: getCallRecordFilters(true)
		}
	}
	searchTerms['updatedAt'] = {
		label: 'Updated At',
		type: 'date',
		addTime: true
	}
	searchTerms['createdAt'] = {
		label: 'Created At',
		type: 'date',
		addTime: true
	}
	if (isEmbedded) {
		searchTerms['isEmpty'] = {
			label: 'Is Empty',
			type: 'boolean'
		}
		searchTerms['isNotEmpty'] = {
			label: 'Is Not Empty',
			type: 'boolean'
		}
	}
	return searchTerms
}

export const getStorePhoneNumberFilters = (isEmbedded: boolean = false) => {
	const searchTerms = {} as SearchTermsType
	searchTerms['id'] = {
		isHidden: !isEmbedded,
		label: 'Quick Select',
		type: 'select',
		isEnum: true,
		loadMoreUrl: '/_api/autocomplete/storePhoneNumbers'
	}
	searchTerms['quickSearch'] = {
		label: 'Quick Search',
		type: 'quickSearch',
		placeholder: 'Search by Name, Phone Number or Details.',
		filters: [
			{
				field: 'name'
			},
			{
				field: 'phoneNo'
			},
			{
				field: 'details'
			}
		]
	}
	searchTerms['name'] = {
		label: 'Name',
		type: 'string'
	}
	searchTerms['phoneNo'] = {
		label: 'Phone Number',
		type: 'string'
	}
	searchTerms['details'] = {
		label: 'Details',
		type: 'string'
	}
	if (!isEmbedded) {
		searchTerms['callRecords'] = {
			label: 'Call Records',
			type: 'relation',
			relationIsMany: true,
			relations: getCallRecordFilters(true)
		}
	}
	searchTerms['updatedAt'] = {
		label: 'Updated At',
		type: 'date',
		addTime: true
	}
	searchTerms['createdAt'] = {
		label: 'Created At',
		type: 'date',
		addTime: true
	}
	if (isEmbedded) {
		searchTerms['isEmpty'] = {
			label: 'Is Empty',
			type: 'boolean'
		}
		searchTerms['isNotEmpty'] = {
			label: 'Is Not Empty',
			type: 'boolean'
		}
	}
	return searchTerms
}

export const getLoginApprovalFilters = (isEmbedded: boolean = false) => {
	const searchTerms = {} as SearchTermsType
	searchTerms['quickSearch'] = {
		label: 'Quick Search',
		type: 'quickSearch',
		placeholder: 'Search by RequestedByUser Full Name, IP Address or Postal Code',
		filters: [
			{
				field: 'requestedUser',
				relationIsMany: false,
				relationField: 'fullName'
			},
			{
				field: 'fingerprint'
			},
			{
				field: 'postal'
			}
		]
	}
	searchTerms['requestedAt'] = {
		label: 'Requested At',
		type: 'date',
		addTime: true
	}
	if (isEmbedded) {
		searchTerms['requestedBy'] = {
			label: 'Requested By',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/users'
		}
		searchTerms['processedBy'] = {
			label: 'Processed By',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/users'
		}
	} else {
		searchTerms['requestedUser'] = {
			label: 'Requested By',
			type: 'relation',
			relationIsMany: false,
			relations: getUserFilters(true)
		}
		searchTerms['processedAdmin'] = {
			label: 'Processed By',
			type: 'relation',
			relationIsMany: false,
			relations: getUserFilters(true)
		}
	}
	searchTerms['requestedTimes'] = {
		label: 'Requested Times',
		type: 'number'
	}
	searchTerms['fingerprint'] = {
		label: 'IP Address',
		type: 'string'
	}
	searchTerms['city'] = {
		label: 'City',
		type: 'string'
	}
	searchTerms['country'] = {
		label: 'Country',
		type: 'string'
	}
	searchTerms['postal'] = {
		label: 'Postal Code',
		type: 'string'
	}
	if (isEmbedded) {
		searchTerms['status'] = {
			label: 'Status',
			type: 'select',
			isEnum: true,
			options: [
				{ value: 'Active', label: 'ACTIVE' },
				{ value: 'Approved', label: 'APPROVED' },
				{ value: 'Denied', label: 'DENIED' }
			]
		}
	}
	searchTerms['expiresAt'] = {
		label: 'Expires At',
		type: 'date'
	}
	searchTerms['approvedAt'] = {
		label: 'Approved At',
		type: 'date',
		addTime: true
	}
	if (isEmbedded) {
		searchTerms['isEmpty'] = {
			label: 'Is Empty',
			type: 'boolean'
		}
		searchTerms['isNotEmpty'] = {
			label: 'Is Not Empty',
			type: 'boolean'
		}
	}
	return searchTerms
}

export const getActivityFilters = (isEmbedded: boolean = false) => {
	const searchTerms = {} as SearchTermsType
	searchTerms['quickSearch'] = {
		label: 'Quick Search',
		type: 'quickSearch',
		placeholder: 'Search by Type or Details',
		filters: [
			{
				field: 'type'
			},
			{
				field: 'details'
			}
		]
	}
	searchTerms['date'] = {
		label: 'Date',
		type: 'date',
		addTime: true
	}
	searchTerms['dateTime'] = {
		label: 'Date Time',
		field: 'date',
		type: 'datetime'
	}
	searchTerms['typeSelect'] = {
		field: 'type',
		label: 'Type (Select)',
		type: 'select',
		loadMoreUrl: '/_api/autocomplete/activityTypes'
	}
	searchTerms['typeSearch'] = {
		field: 'type',
		label: 'Type (Search)',
		type: 'string'
	}
	searchTerms['details'] = {
		label: 'Details',
		type: 'string'
	}
	if (isEmbedded) {
		searchTerms['createdBy'] = {
			label: 'Staff',
			type: 'select',
			isEnum: true,
			loadMoreUrl: '/_api/autocomplete/users'
		}
	} else {
		searchTerms['createdByUser'] = {
			label: 'Staff',
			type: 'relation',
			relations: getUserFilters(true)
		}
	}
	// searchTerms['serviceTypeID'] = {
	// 	label: 'Service Type',
	// 	type: 'select',
	// 	isEnum: true,
	// 	loadMoreUrl: '/_api/autocomplete/serviceTypes'
	// }
	if (isEmbedded) {
		searchTerms['isEmpty'] = {
			label: 'Is Empty',
			type: 'boolean'
		}
		searchTerms['isNotEmpty'] = {
			label: 'Is Not Empty',
			type: 'boolean'
		}
	}
	return searchTerms
}
