<script lang="ts">
	import thumbnail from '$lib/assets/thumbnail.jpg';
	import type { Video } from '@prisma/client';

	export let video: Pick<Video, 'id' | 'title'>;
</script>

<a href="/video/{video.id}" class="text-center">
	<div
		class="card shadow-md duration-100 bg-base-200 w-64 aspect-video bg-cover mb-1"
		style="background-image: url({thumbnail});"
	/>
	{video.title}
</a>
