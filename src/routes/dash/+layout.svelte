<script>
	import { faDashboard, faUpload, faUser, faVideo } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa/src/fa.svelte';
</script>

<div class="flex flex-row h-full space-x-4 m-4">
	<ul class="menu bg-base-200 w-56 h-min p-2 rounded-box">
		<li>
			<a href="/dash">
				<Fa icon={faDashboard} />
				Dashboard
			</a>
		</li>
		<li>
			<a href="/dash/profile">
				<Fa icon={faUser} />
				Profile
			</a>
		</li>
		<li>
			<a href="/dash/videos">
				<Fa icon={faVideo} />
				Videos
			</a>
		</li>
		<li>
			<a href="/dash/upload">
				<Fa icon={faUpload} />
				Upload
			</a>
		</li>
	</ul>

	<div class="w-full">
		<slot />
	</div>
</div>
