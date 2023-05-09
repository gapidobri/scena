import { env } from '$env/dynamic/private';
import prisma from '$lib/prisma';
import s3 from '$lib/s3';
import { uploadFile } from '$lib/utils/upload';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { logger } from '$lib/logger';

export const load: PageServerLoad = async ({ params: { id }, locals: { userId } }) => {
	if (!userId) throw error(401, 'Unauthorized');

	const video = await prisma.video.findFirst({
		where: { id, userId },
		include: {
			videoFile: true,
			thumbnail: true,
			comments: {
				orderBy: { createdAt: 'desc' },
				include: {
					user: {
						select: {
							id: true,
							username: true,
						},
					},
				},
			},
		},
	});
	if (!video) throw error(404, 'Not Found');

	return {
		title: video.title,
		description: video.description,
		published: video.published,
		url: video.videoFile?.url,
		comments: video.comments,
		thumbnail: video.thumbnail?.url,
	};
};

export const actions: Actions = {
	update: async ({ params: { id }, request, locals: { userId } }) => {
		if (!userId) throw error(401, 'Unauthorized');

		const data = await request.formData();
		const published = data.get('published')?.toString() === 'true';

		let video = await prisma.video.findFirst({
			where: { id, userId },
			include: { videoFile: true },
		});
		if (!video) {
			throw error(404, 'Not Found');
		}

		const thumbnail = data.get('thumbnail') as File;
		let thumbnailUploadId: string | null = null;
		if (thumbnail && thumbnail.size) {
			thumbnailUploadId = await uploadFile(thumbnail);
		}

		if (video.videoFile?.key && video.published !== published) {
			await s3
				.putObjectAcl({
					Bucket: env.S3_BUCKET,
					Key: video.videoFile.key,
					ACL: published ? 'public-read' : 'private',
				})
				.promise()
				.catch((err) =>
					logger.error('Error updating video ACL', { userId, videoId: id, error: err }),
				);
		}

		video = await prisma.video.update({
			where: { id },
			data: {
				title: data.get('title')?.toString(),
				published: data.get('published')?.toString() === 'true',
				thumbnail: thumbnailUploadId ? { connect: { id: thumbnailUploadId } } : undefined,
			},
			include: { videoFile: true },
		});

		logger.info('Updated video', { userId, videoId: id, published, title: video.title });

		return {
			title: video.title,
			description: video.description,
			published: video.published,
			url: video.videoFile?.url,
		};
	},

	delete: async ({ params: { id }, locals: { userId } }) => {
		if (!userId) throw error(401, 'Unauthorized');

		const video = await prisma.video.findFirst({
			where: { id, userId },
			select: { id: true, videoFile: { select: { key: true } } },
		});
		if (!video) {
			throw error(404, 'Not Found');
		}

		if (video.videoFile) {
			await s3
				.deleteObject({
					Bucket: env.S3_BUCKET,
					Key: video.videoFile.key,
				})
				.promise();
		}

		await prisma.video.delete({ where: { id: video.id } });

		logger.info('Deleted video', { userId, videoId: id });

		throw redirect(301, '/dash/videos');
	},

	deleteComment: async ({ request, locals: { userId } }) => {
		if (!userId) throw error(401, 'Unauthorized');

		const data = await request.formData();

		const id = data.get('id');
		if (!id) throw error(500, 'Comment id is missing');

		const comment = await prisma.comment.findFirst({
			where: { id: id.toString(), video: { userId } },
		});
		if (!comment) throw error(404, 'Comment not found');

		logger.info('Deleted comment', { userId, commentId: id, title: comment.message });

		await prisma.comment.delete({ where: { id: comment.id } });
	},
};
