import { kratos } from '$lib/ory';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ request, url }) => {
	const flowId = url.searchParams.get('flow');
	if (!flowId) {
		throw redirect(307, env.KRATOS_PUBLIC_URL + '/self-service/registration/browser');
	}

	const flow = await kratos
		.getSelfServiceRegistrationFlow(flowId, request.headers.get('cookie') ?? undefined)
		.then((res) => res.data)
		.catch(() => {
			throw redirect(307, '/registration');
		});

	return { flow };
};
