<script lang="ts">
	import { goto } from '$app/navigation';
	import { Uploader, uploadProgress } from '$lib/upload';

	let files: FileList;
	let progress = 0;

	async function handleUpload() {
		const file = files[0];

		const { fileId, fileKey, videoId } = await fetch('/dash/upload', {
			method: 'POST',
			body: JSON.stringify({
				name: file.name,
			}),
		}).then((res) => res.json());

		new Uploader({
			file,
			fileName: file.name.split('.')[0],
			fileId,
			fileKey,
		})
			.onProgress(({ percentage }) => {
				progress = percentage;
				uploadProgress.set(percentage);
			})
			.onError(console.error)
			.onSuccess(() => {
				uploadProgress.set(null);
				goto(`/dash/videos/${videoId}`);
			})
			.start();
	}
</script>

<div class="flex flex-col items-center mt-32">
	<div class="rounded-box bg-base-200 shadow-xl p-8 w-96">
		<h1 class="text-3xl mb-6 text-center">Upload video</h1>

		<input
			bind:files
			class="file-input file-input-bordered w-full max-w-xs"
			type="file"
			accept="video/*"
			on:change={handleUpload}
		/>

		{#if progress}
			<progress class="progress progress-primary mt-4" value={progress} max="100" />
		{/if}
	</div>
</div>
