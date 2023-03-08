<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="space-y-4 flex">
	{#each data.playlists as playlist}
		<a href="/playlists/{playlist.id}">
			<div class="bg-base-200 rounded-box p-4">
				{playlist.title} - {playlist._count.videos} videos
			</div>
		</a>
	{/each}
</div>
