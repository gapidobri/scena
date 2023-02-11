import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const videos = await prisma.video.findMany({ where: { published: true } });
	return { videos };
};
