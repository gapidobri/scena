import prisma from '$lib/prisma';
import { RatingType, type Rating } from '@prisma/client';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

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

export const load: PageServerLoad = async ({
	params: { id: videoId },
	locals: { userId, session },
}) => {
	const [video, likes, dislikes] = await prisma.$transaction([
		prisma.video.findFirst({
			where: { id: videoId, published: true },
			include: {
				user: { select: { username: true } },
				videoFile: { select: { id: true, key: true, url: true } },
				comments: {
					select: { message: true, user: { select: { username: true } } },
				},
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

	const self = video.userId === userId;

	let userRating: Rating | null = null;
	let subscribed = false;
	if (userId) {
		if (!self) {
			const subscription = await prisma.subscription.findFirst({
				where: {
					subscriberId: userId,
					subscribedId: video.userId,
				},
			});
			subscribed = !!subscription;
		}

		userRating = await getUserRating(userId, videoId);
	}

	// let url: string | null = null;
	// if (video.videoFileId && userId) {
	// 	url = await getPrivateVideoUrl(video.videoFileId, userId);
	// }

	return {
		video,
		likes,
		dislikes,
		url: video.videoFile?.url ?? null,
		rating: userRating?.type ?? null,
		auth: !!session,
		subscribed,
		self,
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

	comment: async ({ params: { id: videoId }, locals: { userId }, request }) => {
		if (!userId) throw error(401, 'Unauthorized');

		const formData = await request.formData();
		const message = formData.get('message')?.toString();
		if (!message) {
			throw error(400, 'Message missing');
		}

		await prisma.comment.create({
			data: { message, videoId, userId },
		});
	},

	subscribe: async ({ params: { id: videoId }, locals: { userId } }) => {
		if (!userId) throw error(401, 'Unauthorized');

		const subscribed = await prisma.video.findUnique({
			where: { id: videoId },
			select: { userId: true },
		});
		if (!subscribed) throw error(404, 'Not Found');

		if (subscribed.userId === userId) throw error(400, "Can't subscribe to yourself");

		const subscribedId_subscriberId = {
			subscribedId: subscribed.userId,
			subscriberId: userId,
		};

		const subscription = await prisma.subscription.findUnique({
			where: { subscribedId_subscriberId },
		});

		if (subscription) {
			await prisma.subscription.delete({
				where: { subscribedId_subscriberId },
			});
		} else {
			await prisma.subscription.create({
				data: {
					subscribed: { connect: { id: subscribed.userId } },
					subscriber: { connect: { id: userId } },
				},
			});
		}
	},
};
