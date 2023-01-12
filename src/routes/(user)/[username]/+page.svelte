<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex justify-center p-4">
	<h1 class="text-4xl">
		{data.user.username}
	</h1>
</div>
