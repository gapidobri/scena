<script lang="ts">
	import Fa from 'svelte-fa';
	import { faUpload } from '@fortawesome/free-solid-svg-icons';

	let videoFiles: FileList;
	let thumbnailInput: HTMLInputElement;
	let thumbnailSrc: string | undefined;

	function handleThumbnailFileChange() {
		const fileReader = new FileReader();
		fileReader.addEventListener('load', (e) => {
			thumbnailSrc = fileReader.result?.toString();
		});
		if (thumbnailInput.files) {
			fileReader.readAsDataURL(thumbnailInput.files[0]);
		}
	}
</script>

<div class="container box is-max-desktop section mt-6">
	<form method="POST" enctype="multipart/form-data">
		<h1 class="title">Upload</h1>

		<div class="field">
			<label for="title">Title</label>
			<input class="input" type="text" name="title" />
		</div>

		<div class="field">
			<label for="description">Description</label>
			<textarea class="textarea" name="description" />
		</div>

		<div class="columns">
			<div class="column">
				<div class="field file">
					<label class="file-label">
						<input
							bind:files={videoFiles}
							type="file"
							class="file-input"
							name="video"
							accept="video/*"
						/>
						<span class="file-cta">
							<span class="file-icon">
								<Fa icon={faUpload} />
							</span>
							<span class="file-label">Video</span>
						</span>
						{#if videoFiles && videoFiles.length}
							<span class="file-name">{videoFiles[0].name}</span>
						{/if}
					</label>
				</div>
			</div>
			<div class="column">
				<div class="file has-name">
					<label class="file-label">
						<input
							class="file-input"
							on:change={handleThumbnailFileChange}
							bind:this={thumbnailInput}
							type="file"
							name="resume"
						/>
						<span class="file-cta">
							<span class="file-icon">
								<Fa icon={faUpload} />
							</span>
							<span class="file-label">Thumbnail</span>
						</span>
					</label>
				</div>
				{#if thumbnailSrc}
					<div class="mt-3">
						<img src={thumbnailSrc} alt="thumbnail" width="300px" />
					</div>
				{/if}
			</div>
		</div>

		<div class="field">
			<button class="button is-primary" type="submit">Upload</button>
		</div>
	</form>
</div>
