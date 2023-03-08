<script lang="ts">
	import VideoDetailCard from '$lib/components/video/VideoDetailCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<span class="text-3xl">{data.playlist.title}</span>

<div class="space-y-4 mt-16">
	{#each data.playlist.videos as entry}
		<VideoDetailCard video={entry.video} />
	{/each}
</div>
