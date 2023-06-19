<script lang="ts">
	import type { PageData } from './$types';
	import VideoDetailCard from '$lib/components/video/VideoDetailCard.svelte';

	export let data: PageData;
</script>

<div class="flex justify-center mt-8">
	<div class="space-y-4 grow max-w-4xl">
		<span class="ml-4 text-3xl">Liked Videos</span>
		{#each data.videos as video}
			<VideoDetailCard {video} />
		{/each}
	</div>
</div>
