import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (!locals.userId) {
		throw redirect(307, '/login?return_to=' + url.pathname);
	}
};
