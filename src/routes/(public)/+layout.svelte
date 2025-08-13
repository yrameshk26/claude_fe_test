<script>
	const { children } = $props()
</script>

<main
	class="relative isolate h-screen overflow-hidden bg-gray-900 bg-cover"
	style:background-image="url('/cover.jpg')"
>
	<div
		class="absolute inset-0 -z-10 h-full w-full overflow-hidden bg-gray-900/80 backdrop-blur-sm"
	></div>
	<div class="flex h-full max-w-4xl flex-col gap-4 overflow-auto p-8 pt-20 lg:px-48">
		<img src="/logo.png" alt="TVUPWEB logo" class="size-24" />
		<h1 class="flex items-end gap-4 text-5xl text-white sm:text-6xl">
			<span class="relative"> TVUPWEB </span>
			<p class="text-center text-sm tracking-normal text-gray-400">
				v{import.meta.env.BUILD_VERSION}
			</p>
		</h1>
		<p class="ml-2 text-xs tracking-normal text-gray-400">
			Last Updated:
			<span class="font-bold"
				>{new Date(import.meta.env.BUILD_TIME).toLocaleString('en-CA', {
					year: 'numeric',
					month: '2-digit',
					day: '2-digit',
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit',
					hour12: false
				})}</span
			>
		</p>
		{#if children}
			{@render children()}
		{/if}
	</div>
</main>
