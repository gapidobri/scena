import prisma from '$lib/prisma';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const jobs = await prisma.transcodeJob.findMany({
		where: { status: 'pending', videoId: { not: null } },
		select: {
			id: true,
			video: { select: { videoFile: { select: { url: true } } } },
		},
	});

	return json(
		jobs.map((job) => ({
			id: job.id,
			url: job.video?.videoFile?.url,
		})),
	);
};
