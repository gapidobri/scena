import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { userId } }) => {
	if (!userId) throw error(401, 'Unauthorized');

	const users = prisma.user.findMany({
		where: {
			subscribers: {
				some: { subscriberId: userId },
			},
		},
		select: {
			id: true,
			username: true,
			profilePicture: { select: { url: true } },
		},
	});

	return { users };
};
