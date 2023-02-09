<script lang="ts">
	import type { User } from '@prisma/client';
	import Avatar from '../common/Avatar.svelte';

	export let user: Pick<User, 'id' | 'username'>;
</script>

<a href="/{user.username}">
	<div class="rounded-box p-4 bg-base-200 flex flex-col items-center">
		<Avatar seed={user.username} class="w-16" />
		<span class="mt-3">{user.username}</span>
	</div>
</a>
