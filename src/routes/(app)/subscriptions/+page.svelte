<script lang="ts">
	import UserCard from '$lib/components/user/UserCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex gap-4">
	{#each data.users as user}
		<UserCard {user} />
	{/each}
</div>
