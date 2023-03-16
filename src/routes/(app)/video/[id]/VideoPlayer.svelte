<script lang="ts">
	import 'vidstack/styles/defaults.css';
	import { goto } from '$app/navigation';
	import type { PlaylistWithVideos } from './+page.server';
	import { onMount } from 'svelte';
	import { defineCustomElements } from 'vidstack/elements';

	export let videoId: string;
	export let url: string;
	export let playlist: PlaylistWithVideos | null = null;

	async function handleVideoEnd() {
		if (playlist) {
			const playlistIndex = playlist.videos.findIndex((v) => v.video.id === videoId);
			if (playlistIndex >= playlist.videos.length - 1) return;
			const nextVideoId = playlist.videos[playlistIndex + 1].video.id;
			await goto(`/video/${nextVideoId}?playlist=${playlist?.id}`);
		}
	}

	let mounted = false;
	onMount(async () => {
		defineCustomElements();
		mounted = true;
	});
</script>

{#if mounted}
	<media-player
		class="card mb-4 aspect-video bg-base-200 shadow-lg"
		src="http://localhost:8080/name-pl.m3u8"
		controls
		autoplay
	>
		<media-outlet />
	</media-player>
{:else}
	<video
		class="card mb-4 aspect-video bg-base-200 shadow-lg"
		src={url}
		controls
		autoplay
		on:ended={handleVideoEnd}
	>
		<track kind="captions" />
	</video>
{/if}
