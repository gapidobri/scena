<script lang="ts">
	import { enhance } from '$app/forms';
	import UserAvatar from '$lib/components/user/UserAvatar.svelte';
	import { faEdit } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa/src/fa.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let profilePictureUrl: string | null = null;

	function updateProfilePicturePreview(files: FileList | null) {
		if (!files) return;

		const fileReader = new FileReader();
		fileReader.onload = () => (profilePictureUrl = fileReader.result as string);
		fileReader.readAsDataURL(files[0]);
	}
</script>

<form
	class="flex flex-col items-center space-y-2 pt-8"
	method="post"
	use:enhance={() => {
		return async ({ update }) => {
			profilePictureUrl = null;
			update();
		};
	}}
>
	<div class="card bg-base-200 w-96 p-4 flex flex-col items-center">
		<input
			class="opacity-0 absolute -z-10"
			type="file"
			accept="image/*"
			name="profilePicture"
			id="profile-picture-picker"
			on:change={(e) => updateProfilePicturePreview(e.currentTarget.files)}
		/>
		<label for="profile-picture-picker" class="avatar group cursor-pointer">
			<div class="w-24 rounded">
				{#if profilePictureUrl}
					<img src={profilePictureUrl} alt="" />
				{:else}
					<UserAvatar user={data.user} />
				{/if}
			</div>
			<div class="absolute w-full h-full invisible group-hover:visible">
				<div class="flex w-full h-full backdrop-blur-sm justify-center rounded items-center">
					<Fa icon={faEdit} color="black" />
				</div>
			</div>
		</label>
		<span class="text-2xl mt-2">{data.user.username}</span>
	</div>

	<label for="username" class="label">
		<span class="label-text">Username</span>
	</label>
	<input
		bind:value={data.user.username}
		type="text"
		name="username"
		id="username"
		class="input input-bordered"
	/>

	<button class="btn btn-primary">Save</button>
</form>
