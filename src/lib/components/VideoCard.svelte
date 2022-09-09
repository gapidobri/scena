<script lang="ts">
	import type { Video } from '@prisma/client';

	export let video: Video;
</script>

<div id="video" class="m-4" style="--thumbnail-url: url({video.thumbnailUrl})">
	<a href="/video/{video.id}">
		<div class="card mb-2">
			<div id="thumbnail" class="card-header" />
		</div>
	</a>

	<h6 id="video-title" class="has-text-weight-bold mx-1">{video.title}</h6>
</div>

<style>
	#video {
		width: 300px;
	}

	#thumbnail {
		background-image: var(--thumbnail-url);
		background-position-x: center;
		background-position-y: center;
		background-size: cover;
		height: 200px;
	}

	#video-title {
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
</style>
