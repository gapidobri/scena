import prisma from '$lib/prisma';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals: { userId } }) => {
	if (!userId) throw error(401, 'Unauthorized');

	const video = await prisma.video.findFirst({
		where: {
			id: params.id,
			userId,
		},
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
	update: async ({ params, request, locals: { userId } }) => {
		if (!userId) throw error(401, 'Unauthorized');

		const data = await request.formData();

		await prisma.video.findFirstOrThrow({ where: { id: params.id, userId } }).catch(() => {
			throw error(404, 'Not Found');
		});

		const video = await prisma.video.update({
			where: { id: params.id },
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
	delete: async ({ params, locals: { userId } }) => {
		if (!userId) throw error(401, 'Unauthorized');

		const video = await prisma.video.findFirst({ where: { id: params.id, userId } });
		if (!video) {
			throw error(404, 'Not Found');
		}

		await prisma.video.delete({ where: { id: video.id } });

		throw redirect(301, '/dash/videos');
	},
};