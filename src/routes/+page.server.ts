import prisma from '$lib/prisma';
import type { Video } from '@prisma/client';
import type { PageServerLoad } from './$types';

type OutputType = {
	videos: Video[];
};

export const load: PageServerLoad<OutputType> = async () => {
	const videos = await prisma.video.findMany({ where: { published: true } });
	return { videos };
};
