<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import { cva, type VariantProps } from 'class-variance-authority'
	import { cn } from '$lib/cn'

	const alertVariants = cva(
		'relative w-full rounded-lg border px-4 py-3 text-sm grid grid-cols-[0_1fr] gap-y-0.5 items-start',
		{
			variants: {
				variant: {
					default: 'bg-card text-card-foreground',
					destructive:
						'text-destructive bg-card border-destructive/50 [&>svg]:text-destructive'
				}
			},
			defaultVariants: {
				variant: 'default'
			}
		}
	)

	let {
		variant = 'default',
		className = '',
		children,
		...restProps
	}: HTMLAttributes<HTMLDivElement> &
		VariantProps<typeof alertVariants> & {
			className?: string
			children?: any
		} = $props()

	const alertClass = $derived(cn(alertVariants({ variant }), className))
</script>

<div
	role="alert"
	class={alertClass}
	{...restProps}
>
	{@render children?.()}
</div>