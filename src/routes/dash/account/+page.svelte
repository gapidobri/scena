<script lang="ts">
	import KratosUi from '$lib/components/kratos/KratosUi.svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

<KratosUi title="Account" ui={data.flow.ui} />
