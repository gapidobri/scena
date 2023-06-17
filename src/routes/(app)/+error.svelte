<script lang="ts">
	import { page } from '$app/stores';
	import { faFrown, faSadCry } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa/src/fa.svelte';
</script>

<div class="flex flex-col items-center justify-center h-1/2">
	<span class="text-2xl mb-10">{$page.error?.message}</span>
	<Fa icon={faFrown} scale={4} />
</div>
