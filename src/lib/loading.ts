import { navigating } from '$app/stores';
import { readable } from 'svelte/store';

let timeout: NodeJS.Timeout;

export const showLoading = readable<boolean>(false, (set) => {
	navigating.subscribe((n) => {
		if (n) {
			clearTimeout(timeout);
			timeout = setTimeout(() => set(true), 200);
		} else {
			set(false);
			clearTimeout(timeout);
		}
	});
});
