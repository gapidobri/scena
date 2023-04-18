import prisma from '$lib/prisma';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { logger } from '$lib/logger';

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
							user: {
								select: {
									id: true,
									username: true,
									profilePicture: { select: { url: true } },
								},
							},
							thumbnail: { select: { url: true } },
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

		logger.info('Deleted playlist', { playlistId: playlist.id, userId });

		throw redirect(301, '/playlists');
	},
};
