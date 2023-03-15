import prisma from '$lib/prisma';
import {
	RatingType,
	type Playlist,
	type PlaylistVideo,
	type Rating,
	type Video,
} from '@prisma/client';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export type PlaylistWithVideos = Playlist & {
	videos: { video: Video; displaySeq: number | null }[];
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

export const load: PageServerLoad = async ({
	params: { id: videoId },
	locals: { userId, session },
	url: { searchParams },
}) => {
	const [video, likes, dislikes, views] = await prisma.$transaction([
		prisma.video.findFirst({
			where: { id: videoId, published: true },
			include: {
				user: {
					select: {
						id: true,
						username: true,
						profilePicture: { select: { url: true } },
					},
				},
				videoFile: { select: { id: true, key: true, url: true } },
				comments: {
					select: { id: true, message: true, user: { select: { id: true, username: true } } },
					orderBy: { createdAt: 'desc' },
				},
			},
		}),
		prisma.rating.count({
			where: { videoId, type: RatingType.like },
		}),
		prisma.rating.count({
			where: { videoId, type: RatingType.dislike },
		}),
		prisma.videoView.count({
			where: { videoId },
		}),
	]);

	if (!video) throw error(404, 'Video not found');

	const playlistId = searchParams.get('playlist');
	let playlist: PlaylistWithVideos | null = null;
	if (playlistId) {
		playlist = await prisma.playlist.findFirst({
			where: {
				id: playlistId,
				videos: { some: { videoId } },
			},
			include: {
				videos: {
					select: { video: true, displaySeq: true },
				},
			},
		});
		if (playlist) {
			playlist.videos.forEach((video, i) => {
				if (video.displaySeq) {
					playlist?.videos.splice(i, 1);
					playlist?.videos.splice(video.displaySeq, 0, video);
				}
			});
		}
	}

	const selfVideo = video.userId === userId;

	let userRating: Rating | null = null;
	let subscribed = false;
	let playlists: (Playlist & { videos: Pick<PlaylistVideo, 'videoId'>[] })[] = [];
	if (userId) {
		if (!selfVideo) {
			const subscription = await prisma.subscription.findFirst({
				where: {
					subscriberId: userId,
					subscribedId: video.userId,
				},
			});
			subscribed = !!subscription;
		}

		userRating = await getUserRating(userId, videoId);

		const res = await prisma.$transaction([
			prisma.videoView.upsert({
				where: {
					videoId_userId: { videoId: video.id, userId },
				},
				create: {
					video: { connect: { id: video.id } },
					user: { connect: { id: userId } },
				},
				update: {
					updatedAt: new Date(),
				},
			}),
			prisma.playlist.findMany({
				where: { userId },
				include: { videos: { select: { videoId: true } } },
			}),
		]);

		playlists = res[1];
	}

	// let url: string | null = null;
	// if (video.videoFileId && userId) {
	// 	url = await getPrivateVideoUrl(video.videoFileId, userId);
	// }

	return {
		video: {
			...video,
			comments: video.comments.map((comment) => ({ ...comment, self: comment.user.id === userId })),
		},
		likes,
		dislikes,
		url: video.videoFile?.url ?? '',
		rating: userRating?.type ?? null,
		auth: !!session,
		subscribed,
		self: selfVideo,
		views,
		playlists,
		playlist,
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

	deleteComment: async ({ request, locals: { userId } }) => {
		if (!userId) throw error(401, 'Unauthorized');

		const data = await request.formData();

		const id = data.get('id');
		if (!id) throw error(500, 'Comment id is missing');

		const comment = await prisma.comment.findFirst({ where: { id: id.toString(), userId } });
		if (!comment) throw error(404, 'Comment not found');

		await prisma.comment.delete({ where: { id: comment.id } });
	},

	addToPlaylist: async ({ request, params: { id: videoId }, locals: { userId } }) => {
		if (!userId) throw error(401, 'Unauthorized');

		const data = await request.formData();

		const playlistIds = Array.from(data.keys());

		await prisma.playlistVideo.deleteMany({
			where: {
				videoId,
				playlist: { userId },
				playlistId: { notIn: playlistIds },
			},
		});

		await prisma.playlistVideo.createMany({
			skipDuplicates: true,
			data: playlistIds.map((playlistId) => ({ videoId, playlistId })),
		});
	},
};
