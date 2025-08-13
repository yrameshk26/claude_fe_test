<script lang="ts">
	import { SolidButton } from '$sveltewind/components/buttons'
</script>

<svelte:head>
	<title>Unauthorized | TVUPWEB</title>
</svelte:head>

<main class="grid h-full grid-cols-5 items-center p-8">
	<div class="col-span-5 mx-auto flex max-w-md flex-col gap-2 p-8 lg:col-span-2">
		<h1 class="text-5xl font-bold tracking-tight text-gray-900">Unauthorized</h1>
		<p class="text-base leading-7 text-gray-600">
			Sorry, you do not have access to view that page. <br />
			Please contact your administrator.
		</p>
		<div class="mt-6">
			<SolidButton href="/">
				<span>&larr;</span>
				Back to home
			</SolidButton>
		</div>
	</div>

	<div class="col-span-5 lg:col-span-3 lg:block">
		<img
			src="/unauthorized.gif"
			alt="Animation of bouncers blocking an entrance"
			class="mx-auto lg:max-w-2xl"
		/>
	</div>
</main>
