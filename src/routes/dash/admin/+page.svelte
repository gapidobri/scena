<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let dialog: HTMLDialogElement;
	let deleteUserId: string;

	function handleDeleteUser(userId: string) {
		deleteUserId = userId;
		dialog.showModal();
	}
</script>

<dialog bind:this={dialog} class="modal">
	<form method="dialog" action="?/deleteUser" class="modal-box">
		<h3 class="font-bold text-lg">Delete user</h3>
		<p class="py-4">Are you sure you want to remove the user?</p>
		<div class="modal-action">
			<button name="userId" formmethod="post" value={deleteUserId} class="btn btn-error">
				Remove
			</button>
			<button formmethod="dialog" class="btn">Cancel</button>
		</div>
	</form>
</dialog>

<span class="text-2xl m-4">Users</span>

<div class="overflow-x-auto">
	<table class="table">
		<thead>
			<tr>
				<th>Username</th>
				<th>E-Mail</th>
				<th>Admin</th>
				<th>Registered</th>
				<th>Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each data.users as user}
				<tr>
					<th><a href="/{user.username}">{user.username}</a></th>
					<td>{user.traits.email}</td>
					<td>{user.admin ? 'Yes' : 'No'}</td>
					<td>
						{#if user.created_at}
							{new Date(user.created_at).toLocaleString()}
						{/if}
					</td>
					<td>
						{#if user.id !== data.userId}
							<button
								type="button"
								on:click={() => handleDeleteUser(user.id)}
								class="btn btn-sm btn-outline btn-error"
							>
								Remove
							</button>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
