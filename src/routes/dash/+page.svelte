<script lang="ts">
	import {
		faEye,
		faNewspaper,
		faPerson,
		faSubscript,
		faThumbsUp,
		faTimes,
		faUser,
		faVideo,
	} from '@fortawesome/free-solid-svg-icons';
	import type { PageData } from './$types';
	import Fa from 'svelte-fa/src/fa.svelte';

	export let data: PageData;
</script>

<div class="flex justify-center">
	<div class="grow flex flex-col max-w-4xl bg-base-200 rounded-xl p-8">
		<span class="text-2xl mb-4">Dashboard</span>

		<div class="stats stats-vertical lg:stats-horizontal shadow">
			<div class="stat">
				<div class="stat-figure text-secondary">
					<Fa icon={faVideo} scale={1.5} />
				</div>
				<div class="stat-title">Videos</div>
				<div class="stat-value">{data.videos}</div>
			</div>

			<div class="stat">
				<div class="stat-figure text-secondary">
					<Fa icon={faEye} scale={1.5} />
				</div>
				<div class="stat-title">Views</div>
				<div class="stat-value">{data.views}</div>
			</div>

			<div class="stat">
				<div class="stat-figure text-secondary">
					<Fa icon={faThumbsUp} scale={1.5} />
				</div>
				<div class="stat-title">Likes</div>
				<div class="stat-value">{data.likes}</div>
			</div>

			<div class="stat">
				<div class="stat-figure text-secondary">
					<Fa icon={faUser} scale={1.5} />
				</div>
				<div class="stat-title">Subscribers</div>
				<div class="stat-value">{data.subscribers}</div>
			</div>
		</div>
	</div>
</div>
