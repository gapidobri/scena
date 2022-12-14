import { env } from '$env/dynamic/private';
import prisma from '$lib/prisma';
import s3 from '$lib/s3';
import { error } from '@sveltejs/kit';
import { v4 as uuid } from 'uuid';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { userId } }) => {
	if (!userId) throw error(401, 'Unauthorized');
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { username: true },
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

		await prisma.user.update({
			where: { id: userId },
			data: {
				username: data.get('username')?.toString(),
			},
		});
	},
};
