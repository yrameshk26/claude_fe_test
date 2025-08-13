<script lang="ts" module>
	export type ChatMessageType = {
		id: string
		message: string
		createdAt: string
		fromUser: {
			id: string
			fullName: string
			imageUrl: string
		}
		toUser: {
			id: string
			fullName: string
			imageUrl: string
		}
		read: boolean
	}

	export type ConversationType = {
		id: string
		otherUser: {
			id: string
			fullName: string
			imageUrl: string
		}
		lastChat: ChatMessageType
	}

	export const chatState = $state({
		isOpen: false,
		activeOtherUserId: '',
		conversationsIsLoading: false,
		conversationsError: '',
		conversations: [] as ConversationType[],
		chatDataIsLoading: false,
		chatDataError: '',
		chatData: {
			conversationID: '',
			toUserID: '',
			chats: {
				data: [] as ChatMessageType[]
			},
			pageNo: 1
		}
	})
</script>

<script lang="ts">
	import { twMerge } from 'tailwind-merge'
	import { slide } from 'svelte/transition'
	import { page } from '$app/state'
	import { connectWebSocket } from '$lib/utils/websocket'

	import { SolidButton, GhostButton } from '$sveltewind/components/buttons'
	import Alert from '$sveltewind/components/display/Alert.svelte'
	import { XMarkIcon, LoadingIcon } from '$sveltewind/icons'

	import UserSelectInput from '../UserSelectInput.svelte'
	import ChatBroadcast from './ChatBroadcast.svelte'
	import ChatConversation from './ChatConversation.svelte'
	import ChatMessage from './ChatMessage.svelte'
	import ChatNewMessage from './ChatNewMessage.svelte'
	import ChatToast from './ChatToast.svelte'

	import { toastState } from '$sveltewind/components/display/Toast.svelte'
	import { untrack } from 'svelte'

	$effect(() => {
		if (chatState.activeOtherUserId) {
			loadConversationMessages(chatState.activeOtherUserId, 1, false)
		} else {
			loadMyConversations()
		}
	})

	const loadMyConversations = () => {
		chatState.conversationsIsLoading = true
		chatState.conversationsError = ''
		fetch('/_api/chat')
			.then((response) => response.json())
			.then((data) => {
				if (data.errors) {
					chatState.conversationsError = data.errors
				} else {
					chatState.conversations = data
				}
			})
			.catch((err) => {
				chatState.conversationsError = err.message
			})
			.finally(() => {
				chatState.conversationsIsLoading = false
			})
	}

	const loadConversationMessages = (toUserID: string, pageNo = 1, showLoading = true) => {
		chatState.chatDataIsLoading = showLoading ? pageNo === 1 : false
		chatState.chatDataError = ''
		const conversation = chatState.conversations.find(({ otherUser }) => otherUser.id === toUserID)
		let queryParam = `?conversationID=${conversation?.id}&page=${pageNo}`
		if (
			conversation?.lastChat &&
			page.data.session.id === conversation.lastChat.toUser.id &&
			!conversation.lastChat.read
		) {
			queryParam += `&markAsRead=true`
			chatState.conversations = chatState.conversations.map((conv) => {
				if (conv.id === conversation.id) {
					conv.lastChat.read = true
				}
				return conv
			})
		}
		fetch(`/_api/chat/${toUserID}${queryParam}`)
			.then((response) => response.json())
			.then(async (data) => {
				if (data.errors) {
					chatState.chatDataError = data.errors
				} else {
					if (chatState.chatData?.chats && pageNo > 1) {
						chatState.chatData.chats.data = [...data.chats.data, ...chatState.chatData.chats.data]
					} else {
						chatState.chatData = { ...data }
					}
					if (toUserID !== chatState.activeOtherUserId) {
						chatState.activeOtherUserId = toUserID
					}
				}
			})
			.catch((err) => {
				chatState.chatDataError = err.message
			})
			.finally(() => {
				chatState.chatDataIsLoading = false
			})
	}

	const showChatNotification = (result: { authUserID: string; message: string }) => {
		toastState.add(ChatToast, {
			snippetProps: { ...result, message: result.message },
			timeout: chatState.isOpen ? 3000 : 10000
		})
		if (chatState.activeOtherUserId === result.authUserID) {
			loadConversationMessages(result.authUserID, 1, false)
		} else {
			loadMyConversations()
		}

		try {
			const notificationSound = new Audio('/notification.mp3')
			notificationSound
				.play()
				.catch((err) => console.error('Error playing notification sound:', err))
		} catch (err) {
			console.error('Error playing notification sound:', err)
		}
	}

	$effect.root(() => {
		let ws: ReturnType<typeof connectWebSocket>
		untrack(() => {
			ws = connectWebSocket('CHAT', (message) => {
				const { data: result } = message
				try {
					if (result.authUserID !== page.data.session?.id) {
						// check if the chat event is for the current user
						if (result.toUserID === page.data.session?.id) {
							// chat from different user
							showChatNotification(result)
						}
					} else {
						if (result.FINGERPRINT !== page.data.session.cookies.TVUPWEB_FINGERPRINT) {
							// check if the chat event is for the current user
							if (result.toUserID === page.data.session?.id) {
								// chat from same user but different device
								showChatNotification(result)
							}
						}
					}
				} catch (err) {
					if (err instanceof Error) {
						console.error('websocket error', err.message)
					} else {
						console.error('websocket error')
					}
				}
			})
		})

		return () => {
			if (ws) ws.disconnect()
		}
	})

	const onLoadMore = async () => {
		if (chatState.chatData?.toUserID) {
			loadConversationMessages(chatState.chatData.toUserID, ++chatState.chatData.pageNo)
		}
	}
</script>

{#if chatState.isOpen}
	<div
		class={twMerge(
			'fixed top-16 right-0 z-60 h-[calc(100dvh-64px)] w-full overflow-hidden bg-slate-100 shadow-2xl lg:max-w-md'
		)}
		transition:slide={{ duration: 300, axis: 'x' }}
	>
		<div class="flex h-full flex-col border-1 border-gray-900/10 shadow-xl">
			<div class="flex items-center justify-between gap-2 p-2">
				{#key chatState.activeOtherUserId}
					<UserSelectInput
						isRequired
						placeholder="Search users"
						onSelect={(option) => {
							loadConversationMessages(option.value as string)
						}}
						value={chatState.activeOtherUserId}
						classContainer="w-full"
					/>
				{/key}
				<ChatBroadcast />
				<SolidButton
					onclick={() => {
						chatState.isOpen = !chatState.isOpen
						chatState.activeOtherUserId = ''
					}}
					class="hover:bg-gray-800/50 focus-visible:bg-gray-700"
					--color-solidButton="var(--color-slate-600)"
				>
					<span class="sr-only">Close sidebar</span>
					<XMarkIcon />
				</SolidButton>
			</div>

			{#if chatState.activeOtherUserId}
				<GhostButton
					onclick={() => (chatState.activeOtherUserId = '')}
					class="mx-2 w-fit"
					--color-ghostButton="var(--color-blue-600)"
				>
					<span class="text-nowrap">
						<span>&larr;</span>
						Back to all Conversations</span
					>
				</GhostButton>
			{/if}

			<div class="flex h-full flex-col overflow-hidden p-2">
				{#if chatState.conversationsError}
					<Alert type="error"
						>{chatState.conversationsError}
						<GhostButton onclick={loadMyConversations} --color-ghostButton="var(--color-red-500)">
							Reload
						</GhostButton>
					</Alert>
				{/if}

				{#if !chatState.activeOtherUserId}
					<ul
						role="list"
						class="flex h-full flex-col gap-2 overflow-x-hidden overflow-y-auto overscroll-contain px-1"
					>
						{#if chatState.conversationsIsLoading}
							<div class="flex h-full items-center justify-center gap-2 text-blue-600">
								<LoadingIcon /> Loading Conversations...
							</div>
						{:else}
							{#each chatState.conversations as conversation, index (conversation.id)}
								{@const isActive = chatState.activeOtherUserId === conversation.otherUser.id}
								<div class="flex items-center gap-2 border-b-1 border-gray-900/10 pb-2">
									{#if isActive}
										<SolidButton
											onclick={() => loadConversationMessages(conversation.otherUser.id)}
											class="w-full"
										>
											<ChatConversation {conversation} {isActive} />
										</SolidButton>
									{:else}
										<GhostButton
											onclick={() => loadConversationMessages(conversation.otherUser.id)}
											class="w-full "
											--color-solidButton="var(--color-gray-400)"
										>
											<ChatConversation
												bind:conversation={chatState.conversations[index]}
												{isActive}
											/>
										</GhostButton>
									{/if}
								</div>
							{/each}
						{/if}
					</ul>
				{:else}
					<div
						class="flex h-full flex-col gap-2 overflow-x-hidden overflow-y-auto overscroll-contain px-1"
					>
						{#key chatState.activeOtherUserId}
							{#if chatState.chatDataError}
								<Alert type="error">{chatState.chatDataError}</Alert>
							{:else}
								<div class="h-full rotate-180 overflow-y-auto overscroll-contain" dir="rtl">
									<div class="flex h-full rotate-180 flex-col-reverse gap-4 px-2 pb-2" dir="ltr">
										{#if chatState.chatDataIsLoading}
											<div class="flex h-full items-center justify-center gap-2 text-blue-600">
												<LoadingIcon /> Loading Messages...
											</div>
										{:else if !chatState.chatData.chats}
											<div>No messages yet</div>
										{:else}
											{#each chatState.chatData.chats.data as chat, i (chat.id)}
												<ChatMessage
													{chat}
													isLastItem={i === chatState.chatData.chats.data.length - 1}
													{onLoadMore}
												/>
											{:else}
												<div class="flex h-full items-center justify-center gap-2 text-orange-600">
													No messages yet
												</div>
											{/each}
										{/if}
									</div>
								</div>
							{/if}
						{/key}
					</div>

					<ChatNewMessage />
				{/if}
			</div>
		</div>
	</div>
{/if}
