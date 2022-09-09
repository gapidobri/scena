import prisma from '$lib/prisma';
import type { Video } from '@prisma/client';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

type OutputType = { video: Video };

export const load: PageServerLoad<OutputType> = async ({ params }) => {
	const video = await prisma.video.findUnique({ where: { id: params.id } });

	if (!video) {
		throw error(404, 'Not found');
	}

	return { video };
};
