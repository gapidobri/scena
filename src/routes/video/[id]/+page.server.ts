import prisma from '$lib/prisma';
import { getPrivateVideoUrl } from '$lib/s3';
import { RatingType, type Rating, type Video } from '@prisma/client';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

type OutputType = {
	video: Video;
	likes: number;
	dislikes: number;
	rating: RatingType | null;
	auth: boolean;
	url: string | null;
};

function getUserRating(userId: string, videoId: string) {
	return prisma.rating.findUnique({
		where: { userId_videoId: { videoId, userId } },
	});
}

function setRating(userId: string, videoId: string, type: RatingType) {
	return prisma.rating.upsert({
		where: {
			userId_videoId: { userId, videoId },
		},
		create: { userId, videoId, type },
		update: { type },
	});
}

function clearRating(userId: string, videoId: string) {
	return prisma.rating.delete({
		where: { userId_videoId: { userId, videoId } },
	});
}

export const load: PageServerLoad<OutputType> = async ({
	params: { id: videoId },
	locals: { userId, session },
}) => {
	const [video, likes, dislikes] = await prisma.$transaction([
		prisma.video.findFirst({
			where: { id: videoId, published: true },
			include: {
				user: { select: { username: true } },
				videoFile: { select: { id: true, key: true } },
			},
		}),
		prisma.rating.count({
			where: { videoId, type: RatingType.like },
		}),
		prisma.rating.count({
			where: { videoId, type: RatingType.dislike },
		}),
	]);

	if (!video) {
		throw error(404, 'Not found');
	}

	let userRating: Rating | null = null;
	if (userId) {
		userRating = await getUserRating(userId, videoId);
	}

	let url: string | null = null;
	if (video.videoFileId && userId) {
		url = await getPrivateVideoUrl(video.videoFileId, userId);
	}

	return {
		video,
		likes,
		dislikes,
		url,
		rating: userRating?.type ?? null,
		auth: !!session,
	};
};

export const actions: Actions = {
	like: async ({ params: { id: videoId }, locals: { userId } }) => {
		if (!userId) throw error(401, 'Unauthorized');

		const userRating = await getUserRating(userId, videoId);
		if (userRating?.type === RatingType.like) {
			await clearRating(userId, videoId);
			return;
		}

		await setRating(userId, videoId, RatingType.like);
	},

	dislike: async ({ params: { id: videoId }, locals: { userId } }) => {
		if (!userId) throw error(401, 'Unauthorized');

		const userRating = await getUserRating(userId, videoId);
		if (userRating?.type === RatingType.dislike) {
			await clearRating(userId, videoId);
			return;
		}

		await setRating(userId, videoId, RatingType.dislike);
	},
};
