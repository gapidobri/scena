import { kratos } from '$lib/ory';
import prisma from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { admin } = await parent();
	if (!admin) throw error(403, 'Forbidden');
};

export const actions: Actions = {
	sync: async () => {
		const res = await kratos.adminListIdentities();

		await prisma.$transaction(
			res.data.map((user) => {
				const username =
					user.traits.email.split('@')[0] +
					Math.floor(Math.random() * 1000000)
						.toString()
						.padStart(6, '0');
				return prisma.user.upsert({
					where: { id: user.id },
					update: {},
					create: { id: user.id, username },
				});
			}),
		);
	},
};
