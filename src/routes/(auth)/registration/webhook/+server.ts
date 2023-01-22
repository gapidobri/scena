import { kratosAdmin } from '$lib/ory';
import prisma from '$lib/prisma';
import type { RequestHandler } from './$types';

type Body = {
	userId: string;
};

export const POST: RequestHandler = async ({ request }) => {
	const { userId }: Body = await request.json();

	const identity = await kratosAdmin.adminGetIdentity(userId);
	const username = identity.data.traits.email.split('@')[0];

	await prisma.user.create({
		data: { id: userId, username },
	});

	return new Response();
};
