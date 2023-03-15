<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import VideoCard from '$lib/components/video/VideoCard.svelte';
	import UserAvatar from '$lib/components/user/UserAvatar.svelte';

	export let data: PageData;
</script>

<div
	class="h-64 bg-cover bg-center flex items-end justify-center rounded-box shadow-lg"
	style="background-image: url('https://unsplash.com/photos/78A265wPiO4/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8Mnx8bmF0dXJlfGVufDB8fHx8MTY3NTk2Mzc2Nw')"
>
	<div class="flex items-end max-w-6xl grow ml-16">
		<UserAvatar user={data.user} class="w-28 rounded-t" />
		<span class="text-3xl ml-4 mb-3 text-white">{data.user.username}</span>

		<form class="grow flex justify-end mb-4" method="post" use:enhance>
			{#if !data.self}
				<button class="btn mt-4" class:btn-primary={!data.subscribed} formaction="?/subscribe">
					{data.subscribed ? 'Subscribed' : 'Subscribe'}
				</button>
			{/if}
		</form>
	</div>
</div>

<div class="flex flex-wrap gap-4 m-8 justify-center cursor-pointer">
	{#each data.user.videos as video}
		<VideoCard {video} />
	{/each}
</div>
