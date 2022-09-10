<script lang="ts">
	import { RatingType } from '@prisma/client';
	import type { PageData } from './$types';

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

		data = { ...data, ...res };
		data.rating = rating;
	}
</script>

<svelte:head>
	<title>{data.video.title}</title>
</svelte:head>

<!-- svelte-ignore a11y-media-has-caption -->
<div class="m-6 is-flex is-flex-direction-column is-align-items-center">
	<div>
		<video id="video-player" controls src={data.video.url} />
		<div class="p-4">
			<div class="is-flex">
				<h4 class="is-size-4 has-text-weight-semibold ">{data.video.title}</h4>
				{#if data.auth}
					<div class="buttons ml-4">
						<button
							class="button"
							on:click={() => handleRate(RatingType.like)}
							class:is-success={data.rating === RatingType.like}
						>
							Like ({data.likes})
						</button>
						<button
							class="button is-danger"
							on:click={() => handleRate(RatingType.dislike)}
							class:is-danger={data.rating === RatingType.dislike}
						>
							Dislike ({data.dislikes})
						</button>
					</div>
				{:else}
					<div class="ml-4 is-flex is-align-items-center">
						<p>{data.likes} likes</p>
						<p class="ml-3">{data.dislikes} dislikes</p>
					</div>
				{/if}
			</div>
			{#if data.video.description}
				<p class="mt-2">{data.video.description}</p>
			{/if}
		</div>
	</div>
</div>

<style>
	#video-player {
		width: 1500px;
	}
</style>
