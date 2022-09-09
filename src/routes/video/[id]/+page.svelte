<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const { video } = data;
</script>

<svelte:head>
	<title>{video.title}</title>
</svelte:head>

<!-- svelte-ignore a11y-media-has-caption -->
<div class="m-6 is-flex is-flex-direction-column is-align-items-center">
	<div>
		<video id="video-player" controls autoplay src={video.url} />
		<h4 class="is-size-4 has-text-weight-semibold ml-2">{video.title}</h4>
	</div>
</div>

<style>
	#video-player {
		width: 1500px;
	}
</style>
