import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { search } = await parent();

	const videos = await prisma.video.findMany({
		where: {
			published: true,
			title: { search: search ?? undefined },
		},
		select: {
			id: true,
			title: true,
			user: {
				select: {
					id: true,
					username: true,
					profilePicture: { select: { url: true } },
				},
			},
			thumbnail: { select: { url: true } },
		},
	});
	return { videos };
};
