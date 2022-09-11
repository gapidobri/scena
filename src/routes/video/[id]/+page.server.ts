import prisma from '$lib/prisma';
import { RatingType, type Video } from '@prisma/client';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

type OutputType = {
	video: Video;
	likes: number;
	dislikes: number;
	rating: RatingType | null;
	auth: boolean;
};

export const load: PageServerLoad<OutputType> = async ({ params, locals }) => {
	const userId = locals.session?.identity?.id;

	const [video, likes, dislikes, userRating] = await Promise.all([
		prisma.video.findUnique({
			where: { id: params.id },
		}),
		prisma.rating.count({
			where: {
				videoId: params.id,
				type: RatingType.like,
			},
		}),
		prisma.rating.count({
			where: {
				videoId: params.id,
				type: RatingType.dislike,
			},
		}),
		userId
			? prisma.rating.findUnique({
					where: {
						userId_videoId: {
							videoId: params.id,
							userId,
						},
					},
			  })
			: null,
	]);

	if (!video) {
		throw error(404, 'Not found');
	}

	return {
		video,
		likes,
		dislikes,
		rating: userRating?.type ?? null,
		auth: !!locals.session,
		canEdit: video.userId === userId,
	};
};
