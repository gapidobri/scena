import { CDN_PUBLIC_URL } from '$env/static/private';
import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { logger } from '$lib/logger';

export const POST: RequestHandler = async ({ params: { id } }) => {
	const job = await prisma.transcodeJob.update({
		where: { id },
		data: { status: 'complete' },
	});
	if (!job.videoId) {
		throw error(404, 'Video not found');
	}

	await prisma.video.update({
		where: { id: job.videoId },
		data: { hlsUrl: `${CDN_PUBLIC_URL}/${job.id}/pl.m3u8` },
	});

	logger.info('Transcode job completed', { jobId: id });

	return new Response();
};
