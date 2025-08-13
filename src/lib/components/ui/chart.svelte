<script lang="ts">
	import { onMount } from 'svelte'
	import { twMerge } from 'tailwind-merge'

	type ChartType = 'bar' | 'line' | 'area' | 'pie'

	type Props = {
		data: any[]
		type?: ChartType
		dataKey?: string
		xAxisKey?: string
		height?: number
		className?: string
		colors?: string[]
		showGrid?: boolean
		showLegend?: boolean
		showTooltip?: boolean
	}

	let {
		data = [],
		type = 'bar',
		dataKey = 'value',
		xAxisKey = 'name',
		height = 400,
		className = '',
		colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'],
		showGrid = true,
		showLegend = true,
		showTooltip = true
	}: Props = $props()

	let chartContainer: HTMLDivElement
	let Recharts: any

	onMount(async () => {
		// Dynamically import Recharts to avoid SSR issues
		Recharts = await import('recharts')
		renderChart()
	})

	$effect(() => {
		if (Recharts && chartContainer) {
			renderChart()
		}
	})

	function renderChart() {
		if (!Recharts || !chartContainer || !data || data.length === 0) return

		// Clear existing chart
		chartContainer.innerHTML = ''

		// Create a simple canvas-based chart as fallback
		const canvas = document.createElement('canvas')
		canvas.width = chartContainer.clientWidth
		canvas.height = height
		chartContainer.appendChild(canvas)
		
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		// Set dark theme colors
		ctx.fillStyle = '#1e293b'
		ctx.fillRect(0, 0, canvas.width, canvas.height)

		if (type === 'bar') {
			renderBarChart(ctx, canvas)
		} else if (type === 'line' || type === 'area') {
			renderLineChart(ctx, canvas, type === 'area')
		} else if (type === 'pie') {
			renderPieChart(ctx, canvas)
		}
	}

	function renderBarChart(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
		const padding = 40
		const barWidth = (canvas.width - padding * 2) / data.length
		const maxValue = Math.max(...data.map(d => d[dataKey]))
		const scale = (canvas.height - padding * 2) / maxValue

		ctx.fillStyle = colors[0]
		data.forEach((item, index) => {
			const barHeight = item[dataKey] * scale
			const x = padding + index * barWidth + barWidth * 0.1
			const y = canvas.height - padding - barHeight
			const width = barWidth * 0.8
			
			// Draw bar with rounded top
			ctx.beginPath()
			ctx.moveTo(x, y + 8)
			ctx.arcTo(x, y, x + 8, y, 8)
			ctx.lineTo(x + width - 8, y)
			ctx.arcTo(x + width, y, x + width, y + 8, 8)
			ctx.lineTo(x + width, canvas.height - padding)
			ctx.lineTo(x, canvas.height - padding)
			ctx.closePath()
			ctx.fill()

			// Draw label
			ctx.fillStyle = '#94a3b8'
			ctx.font = '11px sans-serif'
			ctx.textAlign = 'center'
			ctx.fillText(item[xAxisKey], x + width / 2, canvas.height - padding + 15)
			ctx.fillStyle = colors[0]
		})

		// Draw axis
		ctx.strokeStyle = '#475569'
		ctx.lineWidth = 1
		ctx.beginPath()
		ctx.moveTo(padding, padding)
		ctx.lineTo(padding, canvas.height - padding)
		ctx.lineTo(canvas.width - padding, canvas.height - padding)
		ctx.stroke()
	}

	function renderLineChart(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, isArea: boolean) {
		const padding = 40
		const pointSpacing = (canvas.width - padding * 2) / (data.length - 1)
		const maxValue = Math.max(...data.map(d => d[dataKey]))
		const scale = (canvas.height - padding * 2) / maxValue

		// Draw grid
		if (showGrid) {
			ctx.strokeStyle = '#334155'
			ctx.lineWidth = 0.5
			ctx.setLineDash([3, 3])
			for (let i = 0; i <= 5; i++) {
				const y = padding + (canvas.height - padding * 2) * i / 5
				ctx.beginPath()
				ctx.moveTo(padding, y)
				ctx.lineTo(canvas.width - padding, y)
				ctx.stroke()
			}
			ctx.setLineDash([])
		}

		// Draw line/area
		ctx.strokeStyle = colors[0]
		ctx.lineWidth = 2
		ctx.beginPath()
		
		const points: [number, number][] = []
		data.forEach((item, index) => {
			const x = padding + index * pointSpacing
			const y = canvas.height - padding - item[dataKey] * scale
			points.push([x, y])
			
			if (index === 0) {
				ctx.moveTo(x, y)
			} else {
				ctx.lineTo(x, y)
			}
		})
		
		if (isArea) {
			ctx.lineTo(canvas.width - padding, canvas.height - padding)
			ctx.lineTo(padding, canvas.height - padding)
			ctx.closePath()
			ctx.fillStyle = colors[0] + '4D' // Add transparency
			ctx.fill()
		}
		
		ctx.stroke()

		// Draw points
		ctx.fillStyle = colors[0]
		points.forEach(([x, y]) => {
			ctx.beginPath()
			ctx.arc(x, y, 4, 0, Math.PI * 2)
			ctx.fill()
		})

		// Draw labels
		ctx.fillStyle = '#94a3b8'
		ctx.font = '11px sans-serif'
		ctx.textAlign = 'center'
		data.forEach((item, index) => {
			const x = padding + index * pointSpacing
			ctx.fillText(item[xAxisKey], x, canvas.height - padding + 15)
		})

		// Draw axis
		ctx.strokeStyle = '#475569'
		ctx.lineWidth = 1
		ctx.setLineDash([])
		ctx.beginPath()
		ctx.moveTo(padding, padding)
		ctx.lineTo(padding, canvas.height - padding)
		ctx.lineTo(canvas.width - padding, canvas.height - padding)
		ctx.stroke()
	}

	function renderPieChart(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
		const centerX = canvas.width / 2
		const centerY = canvas.height / 2
		const radius = Math.min(canvas.width, canvas.height) / 3
		const total = data.reduce((sum, item) => sum + item[dataKey], 0)
		
		let currentAngle = -Math.PI / 2

		data.forEach((item, index) => {
			const sliceAngle = (item[dataKey] / total) * Math.PI * 2
			
			// Draw slice
			ctx.fillStyle = colors[index % colors.length]
			ctx.beginPath()
			ctx.moveTo(centerX, centerY)
			ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
			ctx.closePath()
			ctx.fill()
			
			// Draw label
			const labelAngle = currentAngle + sliceAngle / 2
			const labelX = centerX + Math.cos(labelAngle) * (radius * 1.3)
			const labelY = centerY + Math.sin(labelAngle) * (radius * 1.3)
			
			ctx.fillStyle = '#cbd5e1'
			ctx.font = '12px sans-serif'
			ctx.textAlign = 'center'
			ctx.fillText(item[xAxisKey || 'name'], labelX, labelY)
			
			currentAngle += sliceAngle
		})
	}
</script>

<div bind:this={chartContainer} class={twMerge('w-full', className)} style="height: {height}px">
	{#if !data || data.length === 0}
		<div class="flex h-full items-center justify-center text-slate-500">
			No data available
		</div>
	{/if}
</div>