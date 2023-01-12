import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params: { username } }) => {
	const user = await prisma.user.findFirst({
		where: { username },
		select: {
			id: true,
			username: true,
			videos: {
				select: {
					id: true,
					title: true,
				},
			},
		},
	});
	if (!user) throw error(404, 'User not found');

	return { user };
};
