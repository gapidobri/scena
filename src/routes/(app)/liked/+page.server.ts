import prisma from '$lib/prisma';
import { RatingType } from '@prisma/client';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { userId } }) => {
	if (!userId) throw error(401, 'Unauthorized');

	const videos = prisma.video.findMany({
		where: {
			ratings: { some: { userId, type: RatingType.like } },
		},
		include: {
			user: { select: { id: true, username: true } },
			thumbnail: { select: { url: true } },
		},
	});

	return {
		videos,
	};
};
