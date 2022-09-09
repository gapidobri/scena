import prisma from '$lib/prisma';
import { RatingType, type Video } from '@prisma/client';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

type OutputType = {
	video: Video;
	likes: number;
	dislikes: number;
	rating: RatingType | null;
};

export const load: PageServerLoad<OutputType> = async ({ params }) => {
	const [video, likes, dislikes, userRating] = await Promise.all([
		prisma.video.findUnique({
			where: { id: params.id },
		}),
		prisma.video.count({
			where: {
				id: params.id,
				ratings: { some: { type: RatingType.like } },
			},
		}),
		prisma.video.count({
			where: {
				id: params.id,
				ratings: { some: { type: RatingType.dislike } },
			},
		}),
		prisma.rating.findFirst({
			where: {
				videoId: params.id,
				userId: '520fb869-ba7e-4703-bee5-bc982e4ea587',
			},
		}),
	]);

	if (!video) {
		throw error(404, 'Not found');
	}

	return { video, likes, dislikes, rating: userRating?.type ?? null };
};
