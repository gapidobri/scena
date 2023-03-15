<script lang="ts">
	import type { UploadWithUrl } from '$lib/utils/upload';
	import UserAvatar from './UserAvatar.svelte';

	export let user: { id: string; username: string; profilePicture: UploadWithUrl };
</script>

<a href="/{user.username}">
	<div class="rounded-box p-4 bg-base-200 flex flex-col items-center">
		<UserAvatar {user} class="w-16 h-16 rounded" />
		<span class="mt-3">{user.username}</span>
	</div>
</a>
