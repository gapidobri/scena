import { syncUsers } from '$lib/ory';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { admin } = await parent();
	if (!admin) throw error(403, 'Forbidden');
};

export const actions: Actions = {
	sync: async () => {
		await syncUsers();
	},
};
