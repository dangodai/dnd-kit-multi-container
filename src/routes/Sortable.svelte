<script lang="ts">
	import { CSS, styleObjectToString } from '@dnd-kit-svelte/utilities';
	import { useSortable, type UseSortableArguments } from '@dnd-kit-svelte/sortable';

	interface SortableProps extends UseSortableArguments {
		ticket: { id: number, title: string, height?: number }
	}

	let { ticket, ...restProps }: SortableProps = $props();

	const { attributes, listeners, node, transform, transition, isDragging, isSorting, ...rest } = useSortable(
		{
			...restProps
		},
	);

	const style = $derived(
		styleObjectToString({
			transform: CSS.Translate.toString(transform.current),
			transition: isSorting.current ? transition.current : undefined,
			zIndex: isDragging.current ? 1 : undefined
		})
	);

</script>

<div
	class="relative select-none"
	bind:this={node.current}
	{style}
	{...listeners.current}
	{...attributes.current}
>
	{JSON.stringify(rest.data.current.foo)}
	<div
		class={[
			'flex flex-col group shadow rounded-box bg-base-300 p-2 gap-2 hover:ring-2 ring-primary transition',
			`h-${ticket.height ? '[' + ticket.height + 'px]' : '40'}`,
			{ invisible: isDragging.current },
		]}
	>
		<div>
			<div class="badge badge-primary tabular-nums">#{ticket.id}</div>
		</div>
		<div class="font-semibold">
				{ticket.title}
		</div>
	</div>

	<!-- Drag placeholder - set to match original dimensions -->
	{#if isDragging.current}
		<div class="flex items-center justify-center absolute inset-0">
			<!-- You can put any content here for the dragging state -->
			<div
				class={[
					'flex flex-col group shadow rounded-box bg-base-300 p-2 gap-2 border-primary border-dashed border-1 w-full opacity-40',
					`h-${ticket.height ? '[' + ticket.height + 'px]' : '40'}`
				]}
			>
				<div class="badge badge-primary tabular-nums">#{ticket.id}</div>
				<div class="font-semibold">
					<span>
						{ticket.title}
					</span>
				</div>
			</div>
		</div>
	{/if}
</div>
