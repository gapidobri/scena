<script lang="ts">
	import type { UploadWithUrl } from '$lib/utils/upload';

	export let user: { id: string; profilePicture: UploadWithUrl };

	let src =
		user.profilePicture?.url ?? `https://api.dicebear.com/5.x/pixel-art/svg?seed=${user.id}`;
</script>

<img {src} alt="profile_picture" {...$$props} />
