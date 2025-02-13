<script lang="ts">
	import {
		defaultDropAnimationSideEffects,
		DndContext,
		DragOverlay,
		type DragEndEvent,
		type DragOverEvent,
		type DragStartEvent,
		type DropAnimation,
		type UniqueIdentifier
	} from '@dnd-kit-svelte/core';
	import Droppable from './Droppable.svelte';
	import Sortable from './Sortable.svelte';
	import type { PageData } from './$types';
	import { SortableContext, verticalListSortingStrategy } from '@dnd-kit-svelte/sortable';
	import { crossfade } from 'svelte/transition';

	let { data }: { data: PageData } = $props();
	let board = $state(data.board);

	const [send, receive] = crossfade({ duration: 200 });

	function arrayMove2d(
		currentSectionIndex: number,
		currentPosition: number,
		newSectionIndex: number,
		newPosition?: number
	) {
		newPosition = newPosition ?? board.sections[newSectionIndex].tickets.length;

		const movedItem = board.sections[currentSectionIndex].tickets.splice(currentPosition, 1).pop()!;

		console.log(
			`Moving ticket id=${movedItem.id} from [${currentSectionIndex},${currentPosition}] to [${newSectionIndex},${newPosition}]`
		);

		board.sections[newSectionIndex].tickets.splice(newPosition, 0, movedItem);
	}

	function findTicketInBoardById(
		id: number | null
	):
		| { sectionIndex: number; ticketIndex: number; ticket: { id: number; title: string } }
		| undefined {
		for (let [sectionIndex, section] of board.sections.entries()) {
			for (let [ticketIndex, ticket] of section.tickets.entries()) {
				if (ticket.id == id) {
					return {
						sectionIndex,
						ticketIndex,
						ticket
					};
				}
			}
		}
	}

	let activeId: UniqueIdentifier | undefined = $state();
	const activeTicket = $derived(findTicketInBoardById(activeId as number)?.ticket);
	let targetSectionIndex: number | null = null;
	let targetPosition: number | null = null;

	function handleDragStart({ active }: DragStartEvent) {
		activeId = active.id;
		targetSectionIndex = null;
		targetPosition = null;
	}

	function handleDragEnd({ over }: DragEndEvent) {
		if (over == null || activeId == null) {
			activeId = undefined;
			return;
		}

		const activeTicketInfo = findTicketInBoardById(activeId as number)!;
		if (targetSectionIndex !== null && targetSectionIndex === activeTicketInfo.sectionIndex) {
			arrayMove2d(
				activeTicketInfo.sectionIndex,
				activeTicketInfo.ticketIndex,
				targetSectionIndex,
				targetPosition ?? undefined
			);
		}

		activeId = undefined;
		targetSectionIndex = null;
		targetPosition = null;
	}

	function handleDragOver({ over, active }: DragOverEvent) {
		if (over == null || activeId == null) return;

		const activeTicketInfo = findTicketInBoardById(activeId as number)!;
		const isSection = over.id.toString().startsWith('section-');
		const newSectionIndex = isSection
			? board.sections.findIndex((s) => s.id == parseInt((over.id as string).substring(8)))
			: findTicketInBoardById(over.id as number)!.sectionIndex;

		const newPosition = isSection
			? undefined
			: findTicketInBoardById(over.id as number)!.ticketIndex;

		// Move immediately if changing sections
		if (newSectionIndex !== activeTicketInfo.sectionIndex) {
			arrayMove2d(
				activeTicketInfo.sectionIndex,
				activeTicketInfo.ticketIndex,
				newSectionIndex,
				newPosition
			);
		}

		targetSectionIndex = newSectionIndex;
		targetPosition = newPosition ?? null;
	}

	const dropAnimation: DropAnimation = {
		sideEffects: defaultDropAnimationSideEffects({
			styles: {
				active: {
					opacity: '0.5'
				}
			}
		})
	};
</script>

<div class="p-10">
	<span class="text-2xl font-bold">
		{data.board.title}
	</span>

	<DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
		<div class="flex flex-row space-x-2 overflow-x-scroll rounded border p-2 shadow-lg">
			{#each board.sections as section (section.id)}
				<SortableContext items={section.tickets}>
					<Droppable id={`section-${section.id}`}>
						<div
							class="bg-base-200 flex h-full min-h-64 w-72 shrink-0 flex-col items-stretch gap-2 rounded border p-2 shadow"
						>
							<span class="font-semibold">
								{section.title}
							</span>
							<div class="flex h-full grow flex-col gap-2">
								{#each section.tickets as ticket (ticket.id)}
									<div in:receive={{ key: ticket.id }} out:send={{ key: ticket.id }}>
										<!-- <div> -->
										<Sortable id={ticket.id} {ticket} />
									</div>
								{/each}
							</div>
						</div>
					</Droppable>
				</SortableContext>
			{/each}
		</div>
		<DragOverlay {dropAnimation} className="shadow-2xl shadow-black">
			{#if activeTicket}
				<Sortable ticket={activeTicket} id="DragOverlay-{activeId}" />
			{/if}
		</DragOverlay>
	</DndContext>
</div>