<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1 class="text-3xl mb-4 ml-2">Videos</h1>

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
