<script lang="ts">
	import '../app.scss';
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faGithub } from '@fortawesome/free-brands-svg-icons';
	import logoText from '$lib/assets/logo_text.png';
	import { faSearch } from '@fortawesome/free-solid-svg-icons';
	import { uploadProgress } from '$lib/upload';

	export let data: LayoutData;

	let returnTo: string;
	$: returnTo = $page.url.pathname.startsWith('/dash') ? '/' : $page.url.pathname;
</script>

<svelte:head>
	<meta property="og:site_name" content="Scena" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={$page.url.toString()} />
</svelte:head>

<div class="flex flex-col h-screen">
	<div class="navbar bg-base-200">
		<div class="navbar-start">
			<a href="/" class="btn btn-ghost normal-case text-xl">
				<img src={logoText} alt="scena_logo" class="h-8" />
			</a>
		</div>
		<div class="navbar-end flex-none">
			<form class="form-control h-8" action="/" method="get">
				<div class="input-group input-group-sm">
					<input
						name="search"
						type="text"
						placeholder="Search"
						class="input input-sm"
						value={data.search}
					/>
					<button type="submit" class="btn btn-square btn-sm">
						<Fa icon={faSearch} />
					</button>
				</div>
			</form>
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

	<div class="grow flex flex-col">
		<slot />
	</div>

	{#if $uploadProgress}
		<progress class="progress progress-primary fixed bottom-0" value={$uploadProgress} max="100" />
	{/if}

	<div class="fixed bottom-4 right-4">
		<a href="https://github.com/gapidobri/scena">
			<Fa icon={faGithub} size="1.5em" />
		</a>
	</div>
</div>
