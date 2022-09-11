<script lang="ts">
	import { RatingType } from '@prisma/client';
	import type { PageData } from './$types';
	import Fa from 'svelte-fa';
	import { faEdit, faCheck } from '@fortawesome/free-solid-svg-icons';

	export let data: PageData;
	let edit = false;

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

<div class="m-6 is-flex is-flex-direction-column is-align-items-center">
	<div>
		<video id="video-player" controls src={data.video.url}>
			<track kind="captions" />
		</video>
		<div class="p-4">
			<div class="is-flex">
				<div class="is-flex is-flex-grow-1">
					{#if edit}
						<input class="input" type="text" bind:value={data.video.title} placeholder="Title" />
					{:else}
						<span class="is-size-4 has-text-weight-semibold">{data.video.title}</span>
					{/if}
					{#if data.auth}
						<div class="buttons is-flex-wrap-nowrap mx-4">
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
				{#if data.canEdit}
					<button class="button" on:click={() => (edit = !edit)}>
						<span class="icon is-small">
							<Fa icon={edit ? faCheck : faEdit} />
						</span>
					</button>
				{/if}
			</div>

			<p class="mt-2 is-size-7">{data.video.userId}</p>

			<div class="mt-2">
				{#if edit}
					<textarea
						class="textarea"
						bind:value={data.video.description}
						placeholder="Description"
					/>
				{:else}
					<span>{data.video.description ?? ''}</span>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	#video-player {
		width: 1500px;
	}
</style>
