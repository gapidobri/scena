import prisma from '$lib/prisma';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params: { id } }) => {
	const playlist = await prisma.playlist.findUnique({
		where: { id },
		select: {
			id: true,
			title: true,
			videos: {
				select: {
					video: {
						select: {
							id: true,
							title: true,
							description: true,
							user: { select: { id: true, username: true } },
						},
					},
				},
			},
		},
	});

	if (!playlist) throw error(404, 'Playlist not found');

	return { playlist };
};

export const actions: Actions = {
	delete: async ({ params: { id }, locals: { userId } }) => {
		if (!userId) throw error(401, 'Unauthorized');

		const playlist = await prisma.playlist.findFirst({
			where: { id, userId },
		});
		if (!playlist) throw error(404, 'Playlist not found');

		await prisma.playlist.delete({
			where: { id: playlist.id },
		});

		throw redirect(301, '/playlists');
	},
};
