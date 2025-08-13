<script lang="ts">
	import { SolidButton } from '$sveltewind/components/buttons'

	import { page } from '$app/state'
</script>

<svelte:head>
	<title>Error | TVUPWEB</title>
</svelte:head>

<main class="grid h-full grid-cols-5 items-center p-8">
	<div class="col-span-5 mx-auto flex max-w-2xl flex-col gap-2 p-8 lg:col-span-2">
		<h1 class="text-5xl font-bold tracking-tight text-gray-900">{page.error?.message}</h1>
		<p class="text-base leading-7 text-gray-600">
			Please check the URL in the address bar and try again.
		</p>
		<div class="mt-6">
			<SolidButton
				href="/"
				class="gap-2"
				onclick={(e) => {
					e.preventDefault()
					history.back()
				}}
			>
				<span>&larr;</span>
				Go Back
			</SolidButton>
		</div>
	</div>

	<div class="col-span-5 lg:col-span-3 lg:block">
		<img
			src="/error.gif"
			alt="Animated gif of a caveman eating a network wire"
			class="mx-auto max-w-xl"
		/>
	</div>
</main>
