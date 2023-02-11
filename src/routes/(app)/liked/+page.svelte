<script lang="ts">
	import type { PageData } from './$types';
	import VideoDetailCard from '$lib/components/video/VideoDetailCard.svelte';

	export let data: PageData;
</script>

<div class="space-y-4">
	{#each data.videos as video}
		<VideoDetailCard {video} />
	{/each}
</div>
