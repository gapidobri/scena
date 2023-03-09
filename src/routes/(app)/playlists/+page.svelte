<script lang="ts">
	import type { PageData } from './$types';
	import CreatePlaylistModal from './CreatePlaylistButton.svelte';

	export let data: PageData;
</script>

<div class="flex">
	<div class="gap-2 flex grow">
		{#each data.playlists as playlist}
			<a href="/playlists/{playlist.id}">
				<div class="bg-base-200 rounded-box p-4">
					{playlist.title} - {playlist._count.videos} videos
				</div>
			</a>
		{/each}
	</div>
	<CreatePlaylistModal />
</div>
