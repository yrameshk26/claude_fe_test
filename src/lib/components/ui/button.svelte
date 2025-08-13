<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements'
	import { cva, type VariantProps } from 'class-variance-authority'
	import { cn } from '$lib/cn'

	const buttonVariants = cva(
		'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
		{
			variants: {
				variant: {
					default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
					destructive:
						'bg-destructive text-destructive-foreground shadow hover:bg-destructive/90 focus-visible:ring-destructive/20',
					outline:
						'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
					secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
					ghost: 'hover:bg-accent hover:text-accent-foreground',
					link: 'text-primary underline-offset-4 hover:underline'
				},
				size: {
					default: 'h-9 px-4 py-2',
					sm: 'h-8 rounded-md gap-1.5 px-3',
					lg: 'h-10 rounded-md px-6',
					icon: 'size-9'
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