<script lang="ts">
	import { enhance } from '$app/forms';
	import { faTrash } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa/src/fa.svelte';
</script>

<label for="delete-playlist-modal" class="btn btn-error">
	<Fa icon={faTrash} />
</label>

<input type="checkbox" id="delete-playlist-modal" class="modal-toggle" />
<label class="modal cursor-pointer">
	<label class="modal-box relative">
		<h3 class="font-bold text-lg">Are you sure you want to delete this playlist?</h3>
		<form class="modal-action" action="?/delete" method="post" use:enhance>
			<label for="delete-playlist-modal" class="btn">Cancel</label>
			<button type="submit" class="btn btn-error">Delete</button>
		</form>
	</label>
</label>
