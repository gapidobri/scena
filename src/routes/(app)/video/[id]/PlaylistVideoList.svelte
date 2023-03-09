<script lang="ts">
	import type { PlaylistWithVideos } from './+page.server';

	export let playlist: PlaylistWithVideos;
	export let videoId: string;
</script>

<div class="card w-96 bg-base-200">
	<div class="card-body">
		<h2 class="card-title">{playlist.title}</h2>
		{#each playlist.videos as entry}
			<a
				href="/video/{entry.video.id}?playlist={playlist.id}"
				class:text-secondary={entry.video.id === videoId}
			>
				{entry.video.title}
			</a>
		{/each}
	</div>
</div>
