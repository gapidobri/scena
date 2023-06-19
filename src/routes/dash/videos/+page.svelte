<script lang="ts">
	import { faUpload } from '@fortawesome/free-solid-svg-icons';
	import type { PageData } from './$types';
	import Fa from 'svelte-fa/src/fa.svelte';

	export let data: PageData;
</script>

<div class="flex justify-center">
	<div class="grow max-w-5xl bg-base-200 rounded-xl p-8">
		<div class="flex mb-4 ml-2">
			<h1 class="text-3xl">Videos</h1>
			<div class="grow" />
			<a href="/dash/upload" class="btn btn-outline gap-2">
				<Fa icon={faUpload} />
				Upload
			</a>
		</div>

		<div class="w-full">
			<table class="table w-full">
				<thead>
					<tr>
						<th>Title</th>
						<th>Created</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					{#each data.videos as video}
						<tr>
							<td>
								<a class="link link-hover" href="/dash/videos/{video.id}">
									{video.title ?? 'Unnamed Video'}
								</a>
							</td>
							<td>{video.createdAt.toLocaleString()}</td>
							<td>
								{#if video.published}
									<span class="text-green-400">Published</span>
								{:else}
									<span class="text-pink-400">Unpublished</span>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
