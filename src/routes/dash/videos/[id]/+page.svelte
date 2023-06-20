<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import Time from 'svelte-time';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
	import thumbnail from '$lib/assets/thumbnail.jpg';
	import { TranscodeJobStatus } from '@prisma/client';
	import UserAvatar from '$lib/components/user/UserAvatar.svelte';

	export let data: PageData;

	let deleting = false;
	let thumbnailUrl = data.thumbnail ?? thumbnail;

	function updateThumbnailPreview(files: FileList | null) {
		if (!files) return;

		const fileReader = new FileReader();
		fileReader.onload = () => (thumbnailUrl = fileReader.result as string);
		fileReader.readAsDataURL(files[0]);
	}
</script>

<div class="flex justify-center">
	<div class="grow max-w-5xl">
		<form
			class="flex bg-base-200 rounded-xl p-8 pt-4"
			method="POST"
			use:enhance={(req) => {
				req.data.set('published', data.published.toString());
			}}
		>
			<div class="flex flex-col grow">
				<div class="form-control w-full max-w-xs">
					<label class="label" for="title">
						<span class="label-text">Title</span>
					</label>
					<input
						id="title"
						class="input input-bordered w-full max-w-xs"
						type="text"
						name="title"
						bind:value={data.title}
					/>
				</div>

				<br />

				<div class="form-control w-32 mt-4">
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

				<div class="grow" />

				<div>
					<button class="btn btn-primary" formaction="?/update">Update</button>
					<button
						class="btn btn-error"
						class:loading={deleting}
						formaction="?/delete"
						on:click={() => (deleting = true)}
					>
						Delete
					</button>
				</div>
			</div>
			<div class="text-center">
				<div class="card shadow-md duration-100 bg-base-200 w-64 overflow-hidden">
					<div
						class="aspect-video bg-cover bg-center mb-1 flex justify-end"
						style="background-image: url({thumbnailUrl});"
					/>
					<input
						class="opacity-0 absolute -z-10"
						type="file"
						accept="image/*"
						name="thumbnail"
						id="thumbnail-picker"
						on:change={(e) => updateThumbnailPreview(e.currentTarget.files)}
					/>
					<label for="thumbnail-picker" class="bg-neutral flex justify-center py-2 cursor-pointer">
						<Fa icon={faEdit} />
					</label>
				</div>
				{#if data.transcodeStatus}
					<p class="mt-4">Transcode {data.transcodeStatus}</p>
					{#if data.transcodeStatus === TranscodeJobStatus.error}
						<button formaction="?/retryTranscode" class="btn btn-sm btn-error">Retry</button>
					{/if}
				{/if}
			</div>
		</form>

		<div class="mt-4" />

		<div class="rounded-xl bg-base-200 p-8">
			<span class="text-2xl mb-4 ml-2">Comments</span>

			{#each data.comments as comment}
				<form method="post" use:enhance>
					<input type="hidden" name="id" value={comment.id} />
					<div class="chat chat-start">
						<div class="chat-image avatar">
							<div class="w-10 rounded-full">
								<a href="/{comment.user.username}">
									<UserAvatar user={comment.user} />
								</a>
							</div>
						</div>
						<div class="chat-header">
							{comment.user.username}
							<div class="text-xs opacity-50">
								<Time relative timestamp={comment.createdAt} />
							</div>
						</div>
						<div class="flex items-center">
							<div class="chat-bubble">{comment.message}</div>
							<button
								class="btn btn-ghost btn-sm ml-1 hover:text-red-400"
								formaction="?/deleteComment"
							>
								<Fa icon={faTrash} />
							</button>
						</div>
					</div>
				</form>
			{/each}
		</div>
	</div>
</div>
