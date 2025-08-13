<script lang="ts">
	import { SolidButton } from '$sveltewind/components/buttons'
</script>

<svelte:head>
	<title>Maintenance Mode | TVUPWEB</title>
</svelte:head>

<main
	class="grid h-full grid-cols-5 place-items-center items-center justify-center overflow-auto p-8"
>
	<div class="col-span-5 mx-auto flex flex-col gap-2 p-8 lg:col-span-2">
		<div class="flex flex-col gap-4 pb-8">
			<img src="/logo.png" alt="TVUPWEB logo" class="size-24" />
			<h1 class="flex items-end gap-2 text-2xl font-bold sm:text-2xl">
				<span class="relative"> TVUPWEB </span>
				<p class="text-center text-sm tracking-normal text-gray-700">
					v{import.meta.env.BUILD_VERSION}
				</p>
			</h1>
			<p class="text-xs tracking-normal text-gray-700">
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
		</div>

		<h1 class="text-4xl font-semibold tracking-tight text-gray-900">Maintenance Mode</h1>
		<p class="text-base leading-7 text-gray-700">
			We are currently undergoing scheduled maintenance. Please try again later.
		</p>
		<div class="mt-6">
			<SolidButton href="/" data-sveltekit-reload>Refresh</SolidButton>
		</div>
	</div>

	<div class="col-span-5 lg:col-span-3 lg:block">
		<img
			src="/maintenance.gif"
			alt="Animation of bouncers blocking an entrance"
			class="mx-auto lg:max-w-2xl"
		/>
	</div>
</main>
