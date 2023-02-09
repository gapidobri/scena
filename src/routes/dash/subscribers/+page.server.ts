import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { userId } }) => {
	if (!userId) throw error(401, 'Unauthorized');

	const users = await prisma.user.findMany({
		where: {
			subscriptions: {
				some: { subscribedId: userId },
			},
		},
		select: {
			id: true,
			username: true,
		},
	});

	return { users };
};
