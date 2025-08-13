<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements'
	import { cva, type VariantProps } from 'class-variance-authority'
	import { cn } from '$lib/cn'

	const buttonVariants = cva(
		'relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 aria-invalid:ring-destructive/20',
		{
			variants: {
				variant: {
					default: 'bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-100 focus-visible:ring-primary',
					gradient: 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-100 focus-visible:ring-purple-500',
					glow: 'bg-primary text-primary-foreground rounded-xl shadow-glow hover:shadow-glow-lg hover:scale-105 active:scale-100 focus-visible:ring-primary animate-glow',
					destructive:
						'bg-gradient-to-r from-destructive to-pink-600 text-destructive-foreground rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-100 focus-visible:ring-destructive',
					outline:
						'border-2 border-primary bg-transparent text-primary rounded-xl hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:scale-105 active:scale-100',
					secondary: 'bg-secondary text-secondary-foreground rounded-xl shadow-md hover:shadow-lg hover:scale-105 active:scale-100',
					ghost: 'rounded-lg hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-100',
					link: 'text-primary underline-offset-4 hover:underline hover:scale-105 active:scale-100',
					glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl shadow-lg hover:bg-white/20 hover:shadow-xl hover:scale-105 active:scale-100'
				},
				size: {
					default: 'h-11 px-6 py-2.5 text-sm',
					sm: 'h-9 rounded-lg gap-1.5 px-4 text-xs',
					lg: 'h-14 rounded-2xl px-8 text-base',
					xl: 'h-16 rounded-2xl px-10 text-lg',
					icon: 'size-10 rounded-xl'
				}
			},
			defaultVariants: {
				variant: 'default',
				size: 'default'
			}
		}
	)

	let {
		variant = 'default',
		size = 'default',
		isLoading = false,
		className = '',
		disabled = false,
		type = 'button',
		onclick,
		children,
		...restProps
	}: HTMLButtonAttributes & VariantProps<typeof buttonVariants> & {
		isLoading?: boolean
		className?: string
		children?: any
	} = $props()

	const buttonClass = $derived(cn(buttonVariants({ variant, size }), className))
</script>

<button
	class={buttonClass}
	{type}
	disabled={isLoading || disabled}
	{onclick}
	{...restProps}
>
	{#if isLoading}
		<svg
			class="h-4 w-4 animate-spin"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
		>
			<circle
				class="opacity-25"
				cx="12"
				cy="12"
				r="10"
				stroke="currentColor"
				stroke-width="4"
			></circle>
			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			></path>
		</svg>
	{/if}
	{@render children?.()}
</button>