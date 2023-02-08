import prisma from '$lib/prisma';
import type { Comment } from '@prisma/client';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ request, params: { id }, locals: { userId } }) => {
	if (!userId) throw error(401, 'Unauthorized');

	const comment: Comment = await request.json();

	await prisma.comment
		.findFirstOrThrow({
			where: {
				id: comment.id,
				videoId: id,
				userId,
			},
		})
		.catch(() => {
			throw error(404, 'Comment not found');
		});

	await prisma.comment.update({
		where: { id: comment.id },
		data: { message: comment.message },
	});

	return new Response();
};
