<script lang="ts">
	import type { PageData } from './$types';
	import thumbnail from '$lib/assets/thumbnail.jpg';

	export let data: PageData;
</script>

<svelte:head>
	<title>Scena - Home</title>
</svelte:head>

<div class="flex flex-wrap gap-4 m-8 justify-center cursor-pointer">
	{#each data.videos as video}
		<a href="/video/{video.id}" class="text-center">
			<div
				class="card shadow-md duration-100 bg-base-200 w-64 aspect-video bg-cover mb-1"
				style="background-image: url({thumbnail});"
			/>
			{video.title}
		</a>
	{/each}
</div>
