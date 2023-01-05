<script lang="ts">
	import '../app.scss';
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	let returnTo: string;
	$: returnTo = $page.url.pathname.startsWith('/dash') ? '/' : $page.url.pathname;
</script>

<div class="flex flex-col h-screen">
	<div class="navbar bg-base-200">
		<div class="flex-1">
			<a href="/" class="btn btn-ghost normal-case text-xl">Scena</a>
		</div>
		<div class="flex-none">
			<ul class="menu menu-horizontal px-1">
				{#if data.auth}
					<li><a href="/dash">Dashboard</a></li>
					<li><a href="/logout/?return_to={returnTo}">Logout</a></li>
				{:else}
					<li><a href="/login/?return_to={returnTo}">Log In</a></li>
					<li><a href="/registration">Register</a></li>
				{/if}
			</ul>
		</div>
	</div>

	<slot />
</div>
