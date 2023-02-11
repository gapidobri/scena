<script lang="ts">
	import type { PageData } from './$types';
	import VideoCard from '$lib/components/video/VideoCard.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>Scena - Home</title>
</svelte:head>

<div class="flex flex-wrap gap-4 m-8 justify-center cursor-pointer">
	{#each data.videos as video}
		<VideoCard {video} />
	{/each}
</div>
