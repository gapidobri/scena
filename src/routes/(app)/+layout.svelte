<script lang="ts">
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	import { faClock, faHeart, faHome, faList, faPlay } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa/src/fa.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import { showLoading } from '$lib/loading';

	export let data: LayoutData;
</script>

<div class="flex flex-row h-full space-x-4 m-4">
	<ul class="menu bg-base-200 w-56 h-min p-2 rounded-box">
		<li>
			<a href="/" class:active={$page.url.pathname === '/'}>
				<Fa icon={faHome} />
				Home
			</a>
		</li>
		{#if data.auth}
			<li>
				<a href="/liked" class:active={$page.url.pathname === '/liked'}>
					<Fa icon={faHeart} />
					Liked Videos
				</a>
			</li>
			<li>
				<a href="/subscriptions" class:active={$page.url.pathname === '/subscriptions'}>
					<Fa icon={faPlay} />
					Subscriptions
				</a>
			</li>
			<li>
				<a href="/history" class:active={$page.url.pathname === '/history'}>
					<Fa icon={faClock} />
					History
				</a>
			</li>
			<li>
				<a href="/playlists" class:active={$page.url.pathname === '/playlists'}>
					<Fa icon={faList} />
					Playlists
				</a>
			</li>
		{/if}
	</ul>

	<div class="flex-grow pl-0">
		{#if $showLoading}
			<Loading />
		{:else}
			<slot />
		{/if}
	</div>
</div>
