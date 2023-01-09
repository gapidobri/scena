<script lang="ts">
	import { RatingType } from '@prisma/client';
	import Fa from 'svelte-fa/src/fa.svelte';
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { faDownload } from '@fortawesome/free-solid-svg-icons';

	export let data: PageData;
</script>

<svelte:head>
	<title>{data.video.title}</title>
</svelte:head>

<div class="m-6 flex flex-col items-center">
	<div class="max-w-6xl">
		<video class="card mb-4 aspect-video" controls src={data.url}>
			<track kind="captions" />
		</video>

		<div class="mx-4">
			<div class="flex">
				<div class="flex flex-grow items-center">
					<span class="text-xl font-semibold">{data.video.title}</span>

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

					<div class="grow flex justify-end">
						<a href={data.url} rel="noreferrer" target="_blank" class="btn">
							<Fa icon={faDownload} />
						</a>
					</div>
				</div>
			</div>

			<div class="mt-2">
				<span>{data.video.description ?? ''}</span>
			</div>
			<div class="flex mt-4 gap-2">
				{data.video.user.username}

				{#if !data.self}
					<form method="post" use:enhance>
						<button class="btn" class:btn-primary={!data.subscribed} formaction="?/subscribe">
							{data.subscribed ? 'Subscribed' : 'Subscribe'}
						</button>
					</form>
				{/if}
			</div>

			<form
				method="post"
				action="?/comment"
				class="flex flex-col items-start gap-2 mt-8"
				use:enhance
			>
				<textarea name="message" class="textarea textarea-bordered w-96" />
				<button class="btn btn-primary">Post</button>
			</form>

			<div class="space-y-2 mt-8 flex flex-col w-1/3">
				{#each data.video.comments as comment}
					<div class="card bg-base-200 p-4">
						<span class="font-bold">{comment.user.username}</span>
						{comment.message}
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
