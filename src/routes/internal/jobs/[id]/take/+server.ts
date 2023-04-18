import { logger } from '$lib/logger';
import prisma from '$lib/prisma';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params: { id } }) => {
	await prisma.transcodeJob.update({
		where: { id },
		data: { status: 'processing' },
	});

	logger.info('Transcode job started', { jobId: id });

	return new Response();
};
