<script lang="ts">
	import { RatingType } from '@prisma/client';
	import type { PageData } from './$types';
	import UserCard from '$lib/components/video/UserCard.svelte';

	export let data: PageData;

	async function handleRate(rating: RatingType | null) {
		if (!data.auth) return;

		const oldRating = data.rating;
		if (oldRating === rating) rating = null;

		const res = await fetch(`${location.href}/rating?rating=${rating}`, {
			method: rating ? 'POST' : 'DELETE',
		})
			.then((res) => {
				if (res.ok) return res.json();
				throw new Error();
			})
			.catch();

		data = { ...data, ...res, rating };
	}
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
						<div class="buttons nowrap mx-4">
							<button
								class="btn"
								on:click={() => handleRate(RatingType.like)}
								class:is-success={data.rating === RatingType.like}
							>
								Like ({data.likes})
							</button>
							<button
								class="btn"
								on:click={() => handleRate(RatingType.dislike)}
								class:is-danger={data.rating === RatingType.dislike}
							>
								Dislike ({data.dislikes})
							</button>
						</div>
					{:else}
						<div class="ml-4 flex items-center">
							<p>{data.likes} likes</p>
							<p class="ml-3">{data.dislikes} dislikes</p>
						</div>
					{/if}
				</div>
			</div>

			<div class="mt-2">
				<span>{data.video.description ?? ''}</span>
			</div>
			<div class="flex mt-4">
				<UserCard username={data.video.user.username ?? data.video.userId} />
			</div>
		</div>
	</div>
</div>
