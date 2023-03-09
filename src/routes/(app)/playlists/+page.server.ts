import prisma from '$lib/prisma';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { userId } }) => {
	if (!userId) throw error(401, 'Unauthorized');

	const playlists = await prisma.playlist.findMany({
		where: { userId },
		select: { id: true, title: true, _count: { select: { videos: true } } },
	});

	return { playlists };
};

export const actions: Actions = {
	create: async ({ request, locals: { userId } }) => {
		if (!userId) throw error(401, 'Unauthorized');

		const data = await request.formData();

		const title = data.get('title') as string | null;
		if (!title) throw error(400, 'Title is missing');

		const playlist = await prisma.playlist.create({
			data: { userId, title },
		});

		throw redirect(301, `/playlists/${playlist.id}`);
	},
};