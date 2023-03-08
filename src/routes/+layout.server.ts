import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url: { searchParams } }) => {
	const search = searchParams.get('search');
	if (search?.trim() === '') {
		throw redirect(301, '/');
	}
	return { auth: !!locals.session, search };
};
