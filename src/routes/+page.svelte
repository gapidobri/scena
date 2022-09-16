<script lang="ts">
	import VideoCard from '$lib/components/home/VideoCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Scena - Home</title>
</svelte:head>

<div class="is-flex is-flex-wrap-wrap m-5">
	{#each data.videos as video}
		<VideoCard {video} />
	{/each}
</div>
