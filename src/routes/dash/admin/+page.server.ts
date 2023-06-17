import { kratos, syncUsers } from '$lib/ory';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import prisma from '$lib/prisma';
import { logger } from '$lib/logger';

export const load: PageServerLoad = async ({ parent, locals: { userId } }) => {
	const { admin } = await parent();
	if (!admin) throw error(403, 'Forbidden');

	await syncUsers();

	const { data: kratosUsers } = await kratos.adminListIdentities();

	const dbUsers = await prisma.user.findMany();

	const users = kratosUsers.map((kratosUser) => ({
		...kratosUser,
		...dbUsers.find((user) => user.id === kratosUser.id),
	}));

	return { users: users, userId };
};

export const actions: Actions = {
	deleteUser: async ({ request }) => {
		const formData = await request.formData();

		const userId = formData.get('userId') as string | null;
		if (!userId) throw error(400, 'userId is missing');

		await kratos.adminDeleteIdentity(userId);

		await prisma.user.delete({
			where: { id: userId },
		});

		logger.info('Delete user', { userId });
	},
};
