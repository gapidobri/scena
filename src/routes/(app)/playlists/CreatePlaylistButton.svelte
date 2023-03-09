<script lang="ts">
	import { enhance } from '$app/forms';
	import { faAdd } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa/src/fa.svelte';
</script>

<input type="checkbox" id="new-playlist-modal" class="modal-toggle" />
<label class="modal cursor-pointer" for="new-playlist-modal">
	<label class="modal-box relative space-y-2">
		<label for="new-playlist-modal" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
		<h3 class="font-bold text-lg">Create new playlist</h3>
		<form class="flex space-x-2" action="?/create" method="post" use:enhance>
			<input
				type="text"
				name="title"
				placeholder="Playlist name"
				class="input input-bordered w-full"
				required
			/>
			<button class="btn" type="submit">Create</button>
		</form>
	</label>
</label>

<label for="new-playlist-modal" class="btn gap-2">
	<Fa icon={faAdd} />
	New Playlist
</label>
