import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { userId } }) => {
	if (!userId) throw error(401, 'Unauthorized');

	const [videos, views, likes, subscribers] = await prisma.$transaction([
		prisma.video.count({ where: { userId } }),
		prisma.videoView.count({
			where: { video: { userId } },
		}),
		prisma.rating.count({
			where: { video: { userId }, type: 'like' },
		}),
		prisma.subscription.count({
			where: { subscribedId: userId },
		}),
	]);

	return { videos, views, likes, subscribers };
};
