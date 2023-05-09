import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { logger } from '$lib/logger';
import type { Subscription } from '@prisma/client';

export const load: PageServerLoad = async ({ locals: { userId }, params: { username } }) => {
	const user = await prisma.user.findFirst({
		where: { username },
		select: {
			id: true,
			username: true,
			profilePicture: { select: { url: true } },
			videos: {
				select: {
					id: true,
					title: true,
					thumbnail: { select: { url: true } },
					user: { select: { id: true, username: true, profilePicture: { select: { url: true } } } },
				},
			},
		},
	});
	if (!user) throw error(404, 'User not found');

	let subscribed: boolean | null = null;
	if (userId) {
		const subscription = await prisma.subscription.findUnique({
			where: {
				subscribedId_subscriberId: {
					subscriberId: userId,
					subscribedId: user.id,
				},
			},
		});
		subscribed = !!subscription;
	}

	return { user, subscribed, self: userId === user.id };
};

export const actions: Actions = {
	subscribe: async ({ params: { username }, locals: { userId } }) => {
		if (!userId) throw error(401, 'Unauthorized');
		const subscription = await prisma.subscription.findFirst({
			where: {
				subscriberId: userId,
				subscribed: { username },
			},
		});

		if (subscription) {
			await prisma.subscription.delete({
				where: {
					subscribedId_subscriberId: {
						subscribedId: subscription.subscribedId,
						subscriberId: subscription.subscriberId,
					},
				},
			});
			logger.info('Unsubscribed', { userId, username });
		} else {
			await prisma.subscription.create({
				data: {
					subscriber: { connect: { id: userId } },
					subscribed: { connect: { username } },
				},
			});
			logger.info('Subscribed', { userId, username });
		}
	},
};
