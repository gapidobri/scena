<script lang="ts">
	import type { PageData } from './$types';
	import VideoDetailCard from '$lib/components/video/VideoDetailCard.svelte';

	export let data: PageData;
</script>

<div class="p-4">
	<span class="text-3xl">Liked videos</span>

	<div class="p-4 space-y-4">
		{#each data.videos as video}
			<VideoDetailCard {video} />
		{/each}
	</div>
</div>
