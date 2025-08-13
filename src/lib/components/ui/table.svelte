<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import { cn } from '$lib/cn'

	interface TableProps extends HTMLAttributes<HTMLTableElement> {
		className?: string
		containerClassName?: string
		children?: any
	}

	let {
		className = '',
		containerClassName = '',
		children,
		...restProps
	}: TableProps = $props()
</script>

<div class={cn(
	"relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-white/5 via-transparent to-white/5 backdrop-blur-sm border border-white/10",
	containerClassName
)}>
	<div class="w-full overflow-auto">
		<table
			class={cn(
				"w-full caption-bottom text-sm",
				className
			)}
			{...restProps}
		>
			{@render children?.()}
		</table>
	</div>
</div>

<script context="module" lang="ts">
	import type { HTMLThAttributes, HTMLTdAttributes } from 'svelte/elements'

	export interface TableHeaderProps extends HTMLThAttributes {
		className?: string
		children?: any
	}

	export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
		className?: string
		children?: any
	}

	export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
		className?: string
		children?: any
		isHoverable?: boolean
	}

	export interface TableHeadProps extends HTMLThAttributes {
		className?: string
		children?: any
	}

	export interface TableCellProps extends HTMLTdAttributes {
		className?: string
		children?: any
	}
</script>