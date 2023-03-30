import prisma from '$lib/prisma';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params: { id } }) => {
	await prisma.transcodeJob.update({
		where: { id },
		data: { status: 'error' },
	});
	return new Response();
};
