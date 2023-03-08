<script lang="ts">
	import { enhance } from '$app/forms';
	import { faAdd } from '@fortawesome/free-solid-svg-icons';
	import type { Playlist, PlaylistVideo } from '@prisma/client';
	import Fa from 'svelte-fa/src/fa.svelte';

	export let videoId: string;
	export let playlists: (Playlist & { videos: Pick<PlaylistVideo, 'videoId'>[] })[];
</script>

<input type="checkbox" id="add-to-playlist-modal" class="modal-toggle" />
<label for="add-to-playlist-modal" class="modal cursor-pointer">
	<form class="modal-box" method="post" action="?/addToPlaylist" use:enhance>
		<h3 class="font-bold text-lg">Select the playlist</h3>

		{#each playlists as playlist}
			<div class="form-control">
				<label class="label cursor-pointer">
					<span class="label-text">{playlist.title}</span>
					<input
						class="checkbox"
						type="checkbox"
						checked={!!playlist.videos.find((v) => v.videoId === videoId)}
						name={playlist.id}
					/>
				</label>
			</div>
		{/each}

		<div class="modal-action">
			<button class="btn">Save</button>
		</div>
	</form>
</label>

<label class="btn gap-2" for="add-to-playlist-modal">
	<Fa icon={faAdd} />
	Add to playlist
</label>
