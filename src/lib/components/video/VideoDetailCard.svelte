<script lang="ts">
	import type { User, Video } from '@prisma/client';
	import thumbnail from '$lib/assets/thumbnail.jpg';
	import Avatar from '../common/Avatar.svelte';

	export let video: Pick<Video, 'id' | 'title' | 'description'> & {
		user: Pick<User, 'id' | 'username'>;
	};
</script>

<a href="/video/{video.id}" class="flex rounded-box bg-base-200 p-4">
	<div class="rounded-box w-64 aspect-video bg-cover" style="background-image: url({thumbnail});" />

	<div class="ml-3 flex flex-col items-start">
		<div class="flex-grow">
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
