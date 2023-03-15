<script lang="ts">
	import thumbnail from '$lib/assets/thumbnail.jpg';
	import type { UploadWithUrl } from '$lib/utils/upload';
	import UserAvatar from '../user/UserAvatar.svelte';

	export let video: {
		id: string;
		title: string | null;
		description: string | null;
		user: { id: string; username: string; profilePicture: UploadWithUrl };
		thumbnail: UploadWithUrl;
	};
	export let playlist: string | null = null;

	let videoUrl = `/video/${video.id}`;
	if (playlist) videoUrl += `?playlist=${playlist}`;
</script>

<div class="flex rounded-box bg-base-200 p-4">
	<a href={videoUrl} class="flex grow">
		<div
			class="rounded-box w-32 aspect-video bg-cover bg-center"
			style="background-image: url({video.thumbnail?.url ?? thumbnail});"
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
						<UserAvatar user={video.user} />
					</div>
				</div>
				{video.user.username}
			</div>
		</div>
	</a>

	<slot />
</div>
