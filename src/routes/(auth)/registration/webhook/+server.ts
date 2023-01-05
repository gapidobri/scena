import prisma from '$lib/prisma';
import type { RequestHandler } from './$types';

type Body = {
	userId: string;
};

export const POST: RequestHandler = async ({ request }) => {
	const { userId }: Body = await request.json();

	await prisma.user.create({
		data: { id: userId },
	});

	return new Response();
};
