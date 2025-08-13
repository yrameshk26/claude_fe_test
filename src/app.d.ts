// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		type Session = {
			id: string
			fullName: string
			imageUrl: string
			email: string
			isAdmin: boolean
			isLocked: boolean
			isDeleted: boolean
			requiredOTP: boolean
			primaryPhoneNumber: string
			lastLoginDate: string
			updatedAt: string
			unreadAnnouncements: {
				id: string
				message: string
				createdAt: string
			}[]
			activeCall: {
				id: string
				startTime: string
			}
			permissions: {
				id: string
				app: string
				permissionType: string
			}[]
			sessions: {
				id: string
				createdAt: string
				expiresAt: string
				fingerprint: string
				city: string
				country: string
				postal: string
			}[]
			activeStoreId?: string | null
			cookies: {
				[key: string]: string
			}
			unresolvedTicketsCount: number
		}
		// interface Error {}
		interface Locals {
			session: Session
		}
		interface PageData {
			session: Session
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {}
