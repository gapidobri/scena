import { env } from '$env/dynamic/private';
import prisma from '$lib/prisma';
import s3 from '$lib/s3';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params: { id }, locals: { userId } }) => {
	if (!userId) throw error(401, 'Unauthorized');

	const video = await prisma.video.findFirst({
		where: { id, userId },
		include: { videoFile: true },
	});
	if (!video) throw error(404, 'Not Found');

	return {
		title: video.title,
		description: video.description,
		published: video.published,
		url: video.videoFile?.url,
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

		if (video.videoFile?.key && video.published !== published) {
			await s3
				.putObjectAcl({
					Bucket: env.S3_BUCKET,
					Key: video.videoFile.key,
					ACL: published ? 'public-read' : 'private',
				})
				.promise();
		}

		video = await prisma.video.update({
			where: { id },
			data: {
				title: data.get('title')?.toString(),
				published: data.get('published')?.toString() === 'true',
			},
			include: { videoFile: true },
		});

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

		throw redirect(301, '/dash/videos');
	},
};
