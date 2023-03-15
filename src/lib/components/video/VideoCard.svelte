<script lang="ts">
	import thumbnail from '$lib/assets/thumbnail.jpg';
	import type { UploadWithUrl } from '$lib/utils/upload';
	import UserAvatar from '../user/UserAvatar.svelte';

	export let video: {
		id: string;
		title: string | null;
		user: { id: string; username: string; profilePicture: UploadWithUrl };
		thumbnail: UploadWithUrl;
	};
</script>

<a href="/video/{video.id}" class="card overflow-hidden bg-base-200 shadow-md w-64 cursor-pointer">
	<div
		class="aspect-video bg-cover bg-center"
		style="background-image: url({video.thumbnail?.url ?? thumbnail});"
	/>
	<div class="flex flex-row m-2">
		<a href="/{video.user.username}">
			<UserAvatar user={video.user} class="w-8 h-8 rounded-full" />
		</a>
		<div class="ml-2 grow flex flex-col">
			<span class="font-bold overflow-hidden overflow-ellipsis line-clamp-2 grow">
				{video.title}
			</span>
			<a href="/{video.user.username}">{video.user.username}</a>
		</div>
	</div>
</a>
