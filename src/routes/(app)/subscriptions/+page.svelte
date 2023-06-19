<script lang="ts">
	import UserCard from '$lib/components/user/UserCard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex justify-center mt-8">
	<div class="space-y-4 grow max-w-4xl">
		<span class="ml-4 text-3xl">Subscriptions</span>
		<div class="flex gap-4">
			{#each data.users as user}
				<UserCard {user} />
			{/each}
		</div>
	</div>
</div>
