import { V0alpha2Api, Configuration } from '@ory/kratos-client';
import { env } from '$env/dynamic/private';
import prisma from './prisma.js';

export const kratos = new V0alpha2Api(
	new Configuration({
		basePath: env.KRATOS_PRIVATE_URL,
	}),
);

export const kratosAdmin = new V0alpha2Api(
	new Configuration({
		basePath: env.KRATOS_ADMIN_URL,
	}),
);

export async function syncUsers() {
	const res = await kratosAdmin.adminListIdentities();

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
}
