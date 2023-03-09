<script lang="ts">
	import thumbnail from '$lib/assets/thumbnail.jpg';
	import type { Upload, Video } from '@prisma/client';

	export let video: Pick<Video, 'id' | 'title'> & { thumbnail: Pick<Upload, 'url'> | null };
</script>

<a href="/video/{video.id}" class="text-center">
	<div
		class="card shadow-md duration-100 bg-base-200 w-64 aspect-video bg-cover mb-1 cursor-pointer"
		style="background-image: url({video.thumbnail?.url ?? thumbnail});"
	/>
	{video.title}
</a>
