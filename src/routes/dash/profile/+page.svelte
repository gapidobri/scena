<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<form class="flex flex-col items-start space-y-2" method="post" use:enhance>
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
