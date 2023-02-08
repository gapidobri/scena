<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import Time from 'svelte-time';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faTrash } from '@fortawesome/free-solid-svg-icons';

	export let data: PageData;

	let deleting = false;
</script>

<form
	method="POST"
	use:enhance={(req) => {
		req.data.set('published', data.published.toString());
	}}
>
	<input class="input input-bordered" type="text" name="title" bind:value={data.title} />

	<br />

	<div class="form-control">
		<label class="label cursor-pointer" for="published">
			Published
			<input
				class="checkbox checkbox-primary"
				type="checkbox"
				id="published"
				bind:checked={data.published}
			/>
		</label>
	</div>

	<br />

	<button class="btn btn-primary" formaction="?/update">Update</button>
	<button
		class="btn btn-error"
		class:loading={deleting}
		formaction="?/delete"
		on:click={() => (deleting = true)}
	>
		Delete
	</button>

	<div class="divider" />

	<span class="text-2xl mb-4 ml-2">Comments</span>

	{#each data.comments as comment}
		<form method="post">
			<input type="hidden" name="id" value={comment.id} />
			<div class="chat chat-start">
				<div class="chat-image avatar">
					<div class="w-10 rounded-full">
						<a href="/{comment.user.username}">
							<img
								src="https://api.dicebear.com/5.x/pixel-art/svg?seed={comment.user.username}"
								alt="avatar"
							/>
						</a>
					</div>
				</div>
				<div class="chat-header">
					{comment.user.username}
					<div class="text-xs opacity-50"><Time relative timestamp={comment.createdAt} /></div>
				</div>
				<div class="flex items-center">
					<div class="chat-bubble">{comment.message}</div>
					<button class="btn btn-ghost btn-sm ml-1 hover:text-red-400" formaction="?/deleteComment">
						<Fa icon={faTrash} />
					</button>
				</div>
			</div>
		</form>
	{/each}
</form>
