<script lang="ts">
	import VideoDetailCard from '$lib/components/video/VideoDetailCard.svelte';
	import type { PageData } from './$types';
	import DeletePlaylistButton from './DeletePlaylistButton.svelte';

	export let data: PageData;
</script>

<div class="flex justify-center mt-8">
	<div class="space-y-4 grow max-w-4xl">
		<div class="flex">
			<div class="grow">
				<span class="text-3xl">{data.playlist.title}</span>
			</div>
			<DeletePlaylistButton />
		</div>

		<div class="space-y-4 mt-4">
			{#each data.playlist.videos as entry}
				<VideoDetailCard video={entry.video} playlist={data.playlist.id} />
			{/each}
		</div>
	</div>
</div>
