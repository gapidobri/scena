import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { userId } }) => {
	if (!userId) throw error(401, 'Unauthorized');

	const playlists = await prisma.playlist.findMany({
		where: { userId },
		select: { id: true, title: true, _count: { select: { videos: true } } },
	});

	return { playlists };
};
