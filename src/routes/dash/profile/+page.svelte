<script lang="ts">
	import { enhance } from '$app/forms';
	import Avatar from '$lib/components/common/Avatar.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<form class="flex flex-col items-center space-y-2 pt-8" method="post" use:enhance>
	<div class="card bg-base-200 w-96 p-4 flex flex-col items-center">
		<div class="avatar">
			<div class="w-24 rounded">
				<Avatar seed={data.user.username} />
			</div>
		</div>
		<span class="text-2xl mt-2">{data.user.username}</span>
	</div>

	<label for="username" class="label">
		<span class="label-text">Username</span>
	</label>
	<input
		value={data.user.username}
		type="text"
		name="username"
		id="username"
		class="input input-bordered"
	/>

	<button class="btn btn-primary">Save</button>
</form>
