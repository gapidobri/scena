<script lang="ts">
	import type { PageData } from './$types';
	import CreatePlaylistModal from '../../../lib/components/playlist/CreatePlaylistButton.svelte';

	export let data: PageData;
</script>

<div class="flex justify-center mt-8">
	<div class="space-y-4 grow max-w-4xl">
		<div class="flex">
			<span class="ml-4 text-3xl">Playlists</span>
			<div class="grow" />
			<CreatePlaylistModal />
		</div>
		<div class="flex flex-wrap gap-4 m-8 justify-center">
			{#each data.playlists as playlist}
				<a href="/playlists/{playlist.id}">
					<div class="bg-base-200 rounded-box p-4 text-center">
						{#if playlist.videos.find((v) => v.video.thumbnail)}
							<img
								class="w-32 rounded mb-2"
								src={playlist.videos.find((v) => v.video.thumbnail)?.video.thumbnail?.url}
								alt=""
							/>
						{/if}
						<span class=" text-lg">{playlist.title}</span>
					</div>
				</a>
			{/each}
		</div>
	</div>
</div>
