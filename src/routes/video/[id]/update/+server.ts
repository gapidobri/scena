import prisma from '$lib/prisma';
import type { Video } from '@prisma/client';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, params, locals: { userId } }) => {
	const { title, description }: Video = await request.json();

	if (!userId) {
		throw error(401, 'Unauthorized');
	}

	let video = await prisma.video.findFirst({
		where: {
			id: params.id,
			userId,
		},
	});

	if (!video) {
		throw error(404, 'Not Found');
	}

	video = await prisma.video.update({
		where: { id: params.id },
		data: {
			title,
			description,
		},
	});

	return json(video);
};
