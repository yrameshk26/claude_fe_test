const today = new Date().toLocaleDateString('en-CA')
const monthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleDateString(
	'en-CA'
)

const validateFromTo = (
	from: string | null,
	to: string | null,
	uptoDate: string = '2021-01-01'
) => {
	if (!from) {
		from = monthAgo
	}
	if (!to) {
		to = today
	}
	// Ensure from and to are in the correct format and within the last 2 months
	if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to)) {
		from = monthAgo
		to = today
	} else {
		if (new Date(from) < new Date(uptoDate)) {
			from = uptoDate
		}
		if (new Date(to) > new Date(today)) {
			to = today
		}
		if (new Date(from) > new Date(to)) {
			const temp = from
			from = to
			to = temp
		}
	}
	return [from, to]
}

export default {
	validateFromTo
}
