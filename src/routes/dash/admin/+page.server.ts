import { syncUsers } from '$lib/ory';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { logger } from '$lib/logger';

export const load: PageServerLoad = async ({ parent }) => {
	const { admin } = await parent();
	if (!admin) throw error(403, 'Forbidden');
};

export const actions: Actions = {
	sync: async () => {
		logger.info('Syncing users');
		await syncUsers();
	},
};
