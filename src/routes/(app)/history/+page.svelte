<script lang="ts">
	import VideoDetailCard from '$lib/components/video/VideoDetailCard.svelte';
	import type { PageData } from './$types';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faClose } from '@fortawesome/free-solid-svg-icons';
	import { enhance } from '$app/forms';
	import Time from 'svelte-time/src/Time.svelte';

	export let data: PageData;
</script>

<div class="flex justify-center mt-8">
	<div class="space-y-4 grow max-w-4xl">
		<span class="ml-4 text-3xl">History</span>
		{#each data.history as view}
			<form method="post" use:enhance>
				<input type="hidden" name="videoId" value={view.videoId} />
				<VideoDetailCard video={view.video}>
					<div class="flex flex-col items-end">
						<button class="btn btn-ghost btn-sm" formaction="?/delete">
							<Fa icon={faClose} />
						</button>
						<div class="grow" />
						<Time timestamp={view.updatedAt ?? view.createdAt} format="D. M. YYYY, hh:mm" />
					</div>
				</VideoDetailCard>
			</form>
		{/each}
	</div>
</div>
