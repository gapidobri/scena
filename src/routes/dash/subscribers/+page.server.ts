import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { userId } }) => {
	if (!userId) throw error(401, 'Unauthorized');

	const subscriptions = await prisma.subscription.findMany({
		where: { subscribedId: userId },
		select: {
			subscriber: { select: { id: true, username: true } },
		},
	});

	return { subscriptions };
};
