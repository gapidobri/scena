<script lang="ts" type="module">
	import '@vime/core/themes/default.css';
	import { goto } from '$app/navigation';
	import type { PlaylistWithVideos } from './+page.server';
	import { onMount } from 'svelte';
	import { defineCustomElements } from '@vime/core';

	export let videoId: string;
	export let url: string;
	export let hlsUrl: string | null;
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
	{#if hlsUrl}
		<vm-player
			on:vmPlaybackEnded={handleVideoEnd}
			class="mb-4 aspect-video bg-base-200 shadow-lg"
			autoplay
		>
			<vm-hls version="latest">
				<source data-src={hlsUrl} type="application/x-mpegURL" />
			</vm-hls>
			<vm-default-ui />
		</vm-player>
	{:else}
		<vm-player
			on:vmPlaybackEnded={handleVideoEnd}
			class="mb-4 aspect-video bg-base-200 shadow-lg"
			autoplay
		>
			<vm-video>
				<source data-src={url} type="video/mp4" />
			</vm-video>
			<vm-default-ui />
		</vm-player>
	{/if}
{:else}
	<video class="card mb-4 aspect-video bg-base-200 shadow-lg" src={url} controls autoplay>
		<track kind="captions" />
	</video>
{/if}
