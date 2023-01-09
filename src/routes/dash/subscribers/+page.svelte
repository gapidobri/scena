<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1 class="text-3xl">Subscribers</h1>

<div class="flex gap-4 mt-4">
	{#each data.subscriptions as sub}
		<div class="card p-4 bg-base-200 shadow-md">
			{sub.subscriber.username}
		</div>
	{/each}
</div>
