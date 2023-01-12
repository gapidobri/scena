import { kratos } from '$lib/ory';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ request, url }) => {
	const flowId = url.searchParams.get('flow');
	const returnTo = url.searchParams.get('return_to') ?? '/';
	if (!flowId) {
		throw redirect(
			307,
			env.KRATOS_PUBLIC_URL + '/self-service/login/browser?return_to=' + returnTo,
		);
	}

	const flow = await kratos
		.getSelfServiceLoginFlow(flowId, request.headers.get('cookie') ?? undefined)
		.then((res) => res.data);

	return { flow };
};
