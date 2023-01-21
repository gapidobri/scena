import prisma from '$lib/prisma';
import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { userId }, url }) => {
	if (!userId) {
		throw redirect(307, '/login?return_to=' + url.pathname);
	}

	const user = await prisma.user.findUnique({ where: { id: userId } });
	if (!user) throw error(404, 'User not found');

	return {
		admin: user?.admin,
	};
};
