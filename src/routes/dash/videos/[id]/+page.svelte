<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<form
	method="POST"
	use:enhance={(req) => {
		req.data.set('published', data.published.toString());
	}}
>
	<input class="input input-bordered" type="text" name="title" bind:value={data.title} />

	<br />

	<div class="form-control">
		<label class="label cursor-pointer" for="published">
			Published
			<input
				class="checkbox checkbox-primary"
				type="checkbox"
				id="published"
				bind:checked={data.published}
			/>
		</label>
	</div>

	<br />

	<button class="btn btn-primary" formaction="?/update">Update</button>
	<button class="btn btn-error" formaction="?/delete">Delete</button>
</form>
