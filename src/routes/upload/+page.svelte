<script lang="ts">
	import Fa from 'svelte-fa';
	import { faUpload } from '@fortawesome/free-solid-svg-icons';

	let files: FileList | undefined;
</script>

<div class="container is-max-desktop section">
	<form method="POST">
		<h1 class="title">Upload</h1>

		<div class="field">
			<label for="title">Title</label>
			<input class="input" type="text" name="title" required />
		</div>

		<div class="field">
			<label for="description">Description</label>
			<textarea class="textarea" name="description" />
		</div>

		<div class="field file">
			<label class="file-label">
				<input bind:files type="file" class="file-input" name="file" accept="video/*" />
				<span class="file-cta">
					<span class="file-icon">
						<Fa icon={faUpload} />
					</span>
					<span class="file-label">Choose a file</span>
				</span>
				{#if files && files.length}
					<span class="file-name">{files[0].name}</span>
				{/if}
			</label>
		</div>

		<div class="field">
			<button class="button is-primary" type="submit">Upload</button>
		</div>
	</form>
</div>
