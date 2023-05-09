<script lang="ts">
	import { navigating, page } from '$app/stores';
	import {
		faAddressCard,
		faDashboard,
		faNewspaper,
		faRobot,
		faUpload,
		faUser,
		faVideo,
	} from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa/src/fa.svelte';
	import type { LayoutData } from './$types';
	import Loading from '$lib/components/Loading.svelte';
	import { showLoading } from '$lib/loading';

	export let data: LayoutData;
</script>

<div class="flex flex-row h-full space-x-4 m-4">
	<ul class="menu bg-base-200 w-56 h-min p-2 rounded-box">
		<li>
			<a href="/dash" class:active={$page.url.pathname === '/dash'}>
				<Fa icon={faDashboard} />
				Dashboard
			</a>
		</li>
		<li>
			<a href="/dash/profile" class:active={$page.url.pathname.startsWith('/dash/profile')}>
				<Fa icon={faAddressCard} />
				Profile
			</a>
		</li>
		<li>
			<a href="/dash/account" class:active={$page.url.pathname.startsWith('/dash/account')}>
				<Fa icon={faUser} />
				Account
			</a>
		</li>
		<li>
			<a href="/dash/videos" class:active={$page.url.pathname.startsWith('/dash/videos')}>
				<Fa icon={faVideo} />
				Videos
			</a>
		</li>
		<li>
			<a href="/dash/subscribers" class:active={$page.url.pathname.startsWith('/dash/subscribers')}>
				<Fa icon={faNewspaper} />
				Subscribers
			</a>
		</li>
		<li>
			<a href="/dash/upload" class:active={$page.url.pathname.startsWith('/dash/upload')}>
				<Fa icon={faUpload} />
				Upload
			</a>
		</li>
		{#if data.admin}
			<li>
				<a href="/dash/admin" class:active={$page.url.pathname.startsWith('/dash/admin')}>
					<Fa icon={faRobot} />
					Admin
				</a>
			</li>
		{/if}
	</ul>

	<div class="w-full">
		{#if $showLoading}
			<Loading />
		{:else}
			<slot />
		{/if}
	</div>
</div>
