<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Comment, User } from '@prisma/client';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faCheck, faPen, faRemove, faTrash } from '@fortawesome/free-solid-svg-icons';

	export let videoId: string;
	export let comments: { id: string; message: string; user: { username: string }; self: boolean }[];

	let editCommentId: string | null = null;
	let oldComment: string | null = null;

	async function updateComment(comment: Partial<Comment>) {
		await fetch(`/video/${videoId}/comment`, {
			method: 'put',
			body: JSON.stringify(comment),
		});

		editCommentId = null;
		oldComment = null;
	}
</script>

<div class="space-y-2 mt-8 flex flex-col w-1/3">
	{#each comments as comment}
		<form method="post" class="card flex-row bg-base-200 p-4" use:enhance>
			<input type="hidden" name="id" value={comment.id} />
			<div class="flex flex-col">
				<a href="/{comment.user.username}" class="font-bold">{comment.user.username}</a>
				{#if editCommentId === comment.id}
					<textarea class="textarea mt-4" bind:value={comment.message} />
				{:else}
					{comment.message}
				{/if}
			</div>
			<div class="grow" />
			{#if comment.self}
				<div class="hide-no-js flex">
					{#if editCommentId === comment.id}
						<button
							class="btn btn-ghost btn-sm text-green-500"
							on:click|preventDefault={() => updateComment(comment)}
						>
							<Fa icon={faCheck} />
						</button>
						<button
							class="btn btn-ghost btn-sm text-red-500"
							on:click|preventDefault={() => {
								editCommentId = null;
								if (oldComment) comment.message = oldComment;
							}}
						>
							<Fa icon={faRemove} />
						</button>
					{:else}
						<button
							class="btn btn-ghost btn-sm"
							on:click|preventDefault={() => {
								editCommentId = comment.id;
								oldComment = comment.message;
							}}
						>
							<Fa icon={faPen} />
						</button>
					{/if}
				</div>
				<button class="btn btn-ghost btn-sm" formaction="?/deleteComment">
					<Fa icon={faTrash} />
				</button>
			{/if}
		</form>
	{/each}
</div>
