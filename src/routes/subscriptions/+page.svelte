<script lang="ts">
	import UserCard from '$lib/components/user/UserCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="m-4">
	<span class="text-3xl">Subscriptions</span>

	<div class="flex m-4">
		{#each data.users as user}
			<UserCard {user} />
		{/each}
	</div>
</div>
