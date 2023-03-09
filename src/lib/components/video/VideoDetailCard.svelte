<script lang="ts">
	import type { User, Video } from '@prisma/client';
	import thumbnail from '$lib/assets/thumbnail.jpg';
	import Avatar from '../common/Avatar.svelte';

	export let video: Pick<Video, 'id' | 'title' | 'description'> & {
		user: Pick<User, 'id' | 'username'>;
	};
	export let playlist: string | null = null;

	let videoUrl = `/video/${video.id}`;
	if (playlist) videoUrl += `?playlist=${playlist}`;
</script>

<div class="flex rounded-box bg-base-200 p-4">
	<a href={videoUrl} class="flex grow">
		<div
			class="rounded-box w-32 aspect-video bg-cover"
			style="background-image: url({thumbnail});"
		/>

		<div class="ml-3 flex flex-col items-start">
			<div class="grow">
				<span class="text-xl">{video.title}</span>
				{#if video.description}
					<span>{video.description}</span>
				{/if}
			</div>

			<div class="flex flex-col items-center">
				<div class="avatar">
					<div class="w-10 rounded-full">
						<Avatar seed={video.user.username} />
					</div>
				</div>
				{video.user.username}
			</div>
		</div>
	</a>

	<slot />
</div>
