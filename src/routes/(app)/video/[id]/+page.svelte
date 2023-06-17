<script lang="ts">
	import { RatingType } from '@prisma/client';
	import Fa from 'svelte-fa/src/fa.svelte';
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { faDownload, faEdit, faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
	import UserCard from '$lib/components/user/UserCard.svelte';
	import AddToPlaylistModal from '$lib/components/video/AddToPlaylist.svelte';
	import PlaylistVideoList from './PlaylistVideoList.svelte';
	import VideoPlayer from './VideoPlayer.svelte';
	import Comments from './Comments.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>{data.video.title}</title>
	<meta property="og:title" content={data.video.title} />
	{#if data.video.description}
		<meta property="og:description" content={data.video.description} />
	{/if}
</svelte:head>

<div class="m-6 flex flex-col items-center">
	<div class="max-w-6xl w-full flex flex-col">
		<VideoPlayer
			videoId={data.video.id}
			url={data.url}
			hlsUrl={data.hlsUrl}
			playlist={data.playlist}
		/>

		<div class="mx-4">
			<div class="flex">
				<div class="flex flex-grow items-center">
					<h2 class="text-2xl font-semibold">{data.video.title}</h2>

					{#if data.auth}
						<form class="mx-4" method="post" use:enhance>
							<div class="join">
								<button
									class="btn btn-sm join-item"
									formaction="?/like"
									class:btn-success={data.rating === RatingType.like}
								>
									<Fa icon={faThumbsUp} scale={1.2} />
									<span class="text-lg">{data.likes}</span>
								</button>

								<button
									class="btn btn-sm join-item"
									formaction="?/dislike"
									class:btn-error={data.rating === RatingType.dislike}
								>
									<Fa icon={faThumbsDown} scale={1.2} />
									<span class="text-lg">{data.dislikes}</span>
								</button>
							</div>
						</form>
					{:else}
						<div class="ml-4 flex items-center">
							<div class="join">
								<button
									class="btn no-animation btn-sm join-item cursor-default"
									formaction="?/like"
									class:btn-success={data.rating === RatingType.like}
								>
									<Fa icon={faThumbsUp} scale={1.2} />
									<span class="text-lg">{data.likes}</span>
								</button>

								<div
									class="btn no-animation btn-sm join-item cursor-default"
									class:btn-error={data.rating === RatingType.dislike}
								>
									<Fa icon={faThumbsDown} scale={1.2} />
									<span class="text-lg">{data.dislikes}</span>
								</div>
							</div>
						</div>
					{/if}

					<div class="grow flex justify-end space-x-2">
						{#if data.auth}
							<AddToPlaylistModal videoId={data.video.id} playlists={data.playlists} />
						{/if}

						{#if data.self}
							<a href="/dash/videos/{data.video.id}" class="btn gap-2">
								<Fa icon={faEdit} />
								Edit
							</a>
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

			<div class="flex">
				<div class="grow">
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

					<Comments videoId={data.video.id} comments={data.video.comments} />
				</div>

				{#if data.playlist}
					<PlaylistVideoList videoId={data.video.id} playlist={data.playlist} />
				{/if}
			</div>
		</div>
	</div>
</div>
