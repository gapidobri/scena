<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PlaylistWithVideos } from './+page.server';

	export let videoId: string;
	export let url: string;
	export let playlist: PlaylistWithVideos | null = null;

	async function handleVideoEnd() {
		if (playlist) {
			const playlistIndex = playlist.videos.findIndex((v) => v.video.id === videoId);
			if (playlistIndex + 2 >= playlist.videos.length) return;
			const nextVideoId = playlist.videos[playlistIndex + 1].video.id;
			await goto(`/video/${nextVideoId}?playlist=${playlist?.id}`);
		}
	}
</script>

<video
	class="card mb-4 aspect-video bg-base-200 shadow-lg"
	src={url}
	controls
	autoplay
	on:ended={handleVideoEnd}
>
	<track kind="captions" />
</video>
