import prisma from '$lib/prisma';
import { RatingType } from '@prisma/client';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ url, params, locals }) => {
	const userId = locals.session?.identity.id;
	if (!userId) {
		throw error(401, 'Unauthorized');
	}

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
				userId,
				videoId: params.id,
			},
		},
		create: {
			userId,
			videoId: params.id,
			type,
		},
		update: { type },
	});

	const [likes, dislikes] = await Promise.all([
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
	]);

	return json({ likes, dislikes });
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const userId = locals.session?.identity.id;
	if (!userId) {
		throw error(401, 'Unauthorized');
	}

	await prisma.rating.delete({
		where: {
			userId_videoId: {
				userId,
				videoId: params.id,
			},
		},
	});

	const [likes, dislikes] = await Promise.all([
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
	]);

	return json({ likes, dislikes });
};
