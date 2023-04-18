import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { logger } from '$lib/logger';

export const load: PageServerLoad = async ({ locals: { userId } }) => {
	if (!userId) throw error(401, 'Unauthorized');

	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			history: {
				orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
				include: {
					video: {
						include: {
							user: {
								select: {
									id: true,
									username: true,
									profilePicture: { select: { url: true } },
								},
							},
							thumbnail: { select: { url: true } },
						},
					},
				},
			},
		},
	});

	if (!user) throw error(404, 'User not found');

	return {
		history: user.history,
	};
};

export const actions: Actions = {
	delete: async ({ request, locals: { userId } }) => {
		if (!userId) throw error(401, 'Unauthorized');

		const data = await request.formData();

		const videoId = data.get('videoId') as string | null;
		if (!videoId) throw error(400, 'Video id is missing');

		await prisma.videoView.delete({
			where: { videoId_userId: { videoId, userId } },
		});

		logger.info('Deleted video from history', { videoId, userId });
	},
};
