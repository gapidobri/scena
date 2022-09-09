<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	const { video } = data;
</script>

<svelte:head>
	<title>{video.title}</title>
</svelte:head>

<h4 class="is-size-4">{video.title}</h4>
