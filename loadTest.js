import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
	vus: 20, // number of virtual users
	duration: '60s', // test duration
	thresholds: {
		http_req_duration: ['p(95)<1000'] // 95% of requests under 1000ms
	}
}

// const URL = 'https://tvupweb-be.azurewebsites.net'
const URL = 'https://v2.tvupweb-be.antlo.dev'
// const URL = 'https://tvupweb-api-v2.onrender.com'
const APPS = ['BILLING', 'ACCOUNTING', 'CALLTRACK']

// Function to generate random IP address
function getRandomIP() {
	return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
}

// Function to pick a random item from an array
function getRandomItem(arr) {
	return arr[Math.floor(Math.random() * arr.length)]
}

// Function to generate a random integer between two values (inclusive)
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

// Function to log in and return cookies
function loginUser() {
	const loginMutation = `mutation LOGIN($email: EmailAddress!, $password: String!, $fingerprint: String!, $city: String!, $country: String!, $postal: String!) {
    login(email: $email, password: $password, fingerprint: $fingerprint, city: $city, country: $country, postal: $postal)
  }`

	const variables = {
		email: 'g1hdiptv@gmail.com',
		password: 'Golumbia@144',
		fingerprint: getRandomIP(),
		city: 'k6_city',
		country: 'k6_country',
		postal: 'k6_postal'
	}

	const res = http.post(
		URL,
		JSON.stringify({
			query: loginMutation,
			variables
		}),
		{
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		}
	)

	check(res, {
		'login successful': (r) => r.status === 200
	})

	// get the token from the response to store as cookie
	return res.json().data.login.token
}

// Function to perform queries
function performQueries(cookieValue) {
	const queries = [
		{ query: `query { getAllCustomers }` },
		{ query: `query { getSideBarCounts(app: "${getRandomItem(APPS)}") }` },
		// { query: `query { getBillingDashboardCounts }` },
		{ query: `query { getAllStorePhoneNumbers }` },
		{ query: `query { getMyConversations }` },
		{ query: `query { getMyProfile }` }
	]

	queries.forEach((q) => {
		const res = http.post(URL, JSON.stringify(q), {
			headers: {
				'Content-Type': 'application/json',
				Cookie: `AUTH_SESSION_ID=${cookieValue}`
			}
		})
		check(res, {
			'query successful': (r) => r.status === 200
		})

		sleep(getRandomInt(1, 3)) // Simulate real users
	})
}

// Function to simulate refetching data after an event
function refetchDataAfterEvent(cookieValue) {
	const refetchQueries = [
		// { query: `query { getBillingDashboardCounts }` },
		{ query: `query { getAllStorePhoneNumbers }` },
		{ query: `query { getMyConversations }` }
	]

	refetchQueries.forEach((q) => {
		const res = http.post(URL, JSON.stringify(q), {
			headers: {
				'Content-Type': 'application/json',
				Cookie: `AUTH_SESSION_ID=${cookieValue}`
			}
		})

		check(res, {
			'refetch successful': (r) => r.status === 200
		})

		sleep(getRandomInt(1, 2)) // Shorter sleep to simulate quick refetch
	})
}

export default function () {
	const cookie = loginUser()
	performQueries(cookie)
	refetchDataAfterEvent(cookie) // Simulate real-time event refetch
}
