<script lang="ts">
	import { RatingType, type Comment } from '@prisma/client';
	import Fa from 'svelte-fa/src/fa.svelte';
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { faCheck, faDownload, faPen, faRemove, faTrash } from '@fortawesome/free-solid-svg-icons';
	import UserCard from '$lib/components/user/UserCard.svelte';

	export let data: PageData;

	let editCommentId: string | null = null;
	let oldComment: string | null = null;

	async function updateComment(comment: Partial<Comment>) {
		await fetch(`/video/${data.video.id}/comment`, {
			method: 'put',
			body: JSON.stringify(comment),
		});

		editCommentId = null;
		oldComment = null;
	}
</script>

<svelte:head>
	<title>{data.video.title}</title>
</svelte:head>

<div class="m-6 flex flex-col items-center">
	<div class="max-w-6xl w-full flex flex-col">
		<video class="card mb-4 aspect-video bg-base-200 shadow-lg" controls src={data.url}>
			<track kind="captions" />
		</video>

		<div class="mx-4">
			<div class="flex">
				<div class="flex flex-grow items-center">
					<span class="text-2xl font-semibold">{data.video.title}</span>

					{#if data.auth}
						<form class="mx-4" method="post" use:enhance>
							<button
								class="btn"
								formaction="?/like"
								class:btn-success={data.rating === RatingType.like}
							>
								Like ({data.likes})
							</button>

							<button
								class="btn"
								formaction="?/dislike"
								class:btn-error={data.rating === RatingType.dislike}
							>
								Dislike ({data.dislikes})
							</button>
						</form>
					{:else}
						<div class="ml-4 flex items-center">
							<p>{data.likes} likes</p>
							<p class="ml-3">{data.dislikes} dislikes</p>
						</div>
					{/if}

					<div class="grow flex justify-end space-x-2">
						{#if data.self}
							<a href="/dash/videos/{data.video.id}" class="btn">Edit</a>
						{/if}
						<a href={data.url} rel="noreferrer" target="_blank" class="btn">
							<Fa icon={faDownload} />
						</a>
					</div>
				</div>
			</div>

			{#if data.views === 1}
				{data.views} view
			{:else}
				{data.views} views
			{/if}

			<div class="mt-2">
				<span>{data.video.description ?? ''}</span>
			</div>
			<div class="flex mt-4 gap-2">
				<UserCard user={data.video.user} />
				{#if data.auth && !data.self}
					<form method="post" use:enhance>
						<button class="btn" class:btn-primary={!data.subscribed} formaction="?/subscribe">
							{data.subscribed ? 'Subscribed' : 'Subscribe'}
						</button>
					</form>
				{/if}
			</div>

			{#if data.auth}
				<form
					method="post"
					action="?/comment"
					class="flex flex-col items-start gap-2 mt-8"
					use:enhance
				>
					<textarea
						name="message"
						placeholder="Comment"
						class="textarea textarea-bordered w-96"
						required
					/>
					<button class="btn btn-primary">Post</button>
				</form>
			{/if}

			<div class="space-y-2 mt-8 flex flex-col w-1/3">
				{#each data.video.comments as comment}
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
		</div>
	</div>
</div>
