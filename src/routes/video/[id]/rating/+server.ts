import prisma from '$lib/prisma';
import { RatingType } from '@prisma/client';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ url, params }) => {
	const ratingParam = url.searchParams.get('rating');

	if (!ratingParam) {
		throw error(400, 'Rating query paramter is missing');
	}
	if (!Object.keys(RatingType).includes(ratingParam)) {
		throw error(400, 'Invalid rating type');
	}

	const type = RatingType[ratingParam as keyof typeof RatingType];

	await prisma.rating.upsert({
		where: {
			userId_videoId: {
				userId: '520fb869-ba7e-4703-bee5-bc982e4ea587',
				videoId: params.id,
			},
		},
		create: {
			userId: '520fb869-ba7e-4703-bee5-bc982e4ea587',
			videoId: params.id,
			type,
		},
		update: { type },
	});

	const [likes, dislikes] = await Promise.all([
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
	]);

	return json({ likes, dislikes });
};

export const DELETE: RequestHandler = async ({ params }) => {
	await prisma.rating.delete({
		where: {
			userId_videoId: {
				userId: '520fb869-ba7e-4703-bee5-bc982e4ea587',
				videoId: params.id,
			},
		},
	});

	const [likes, dislikes] = await Promise.all([
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
	]);

	return json({ likes, dislikes });
};
