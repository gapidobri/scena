import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

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
