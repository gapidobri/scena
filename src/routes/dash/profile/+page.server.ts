import prisma from '$lib/prisma';
import { uploadFile } from '$lib/utils/upload';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { logger } from '$lib/logger';

export const load: PageServerLoad = async ({ locals: { userId } }) => {
	if (!userId) throw error(401, 'Unauthorized');

	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			username: true,
			profilePicture: { select: { url: true } },
		},
	});

	if (!user) throw error(404, 'Not found');

	return {
		user,
	};
};

export const actions: Actions = {
	default: async ({ request, locals: { userId } }) => {
		if (!userId) throw error(401, 'Unauthorized');

		const data = await request.formData();

		const profilePicture = data.get('profilePicture') as File | null;
		let uploadId: string | null = null;
		if (profilePicture) {
			uploadId = await uploadFile(profilePicture);
		}

		const user = await prisma.user.update({
			where: { id: userId },
			data: {
				username: data.get('username')?.toString(),
				profilePicture: { connect: { id: uploadId ?? undefined } },
			},
		});

		logger.info('Updated profile', { userId, profilePictureId: uploadId, username: user.username });
	},
};
