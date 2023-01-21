<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<form method="post" use:enhance>
	<button class="btn" formaction="?/sync">Sync Users</button>
</form>
