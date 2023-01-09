import { env } from '$env/dynamic/private';
import { kratos } from '$lib/ory';

import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request, url }) => {
	const flowId = url.searchParams.get('flow');
	if (!flowId) {
		throw redirect(307, env.KRATOS_PUBLIC_URL + '/self-service/settings/browser');
	}

	const flow = await kratos
		.getSelfServiceSettingsFlow(flowId, undefined, request.headers.get('cookie') ?? undefined)
		.then((res) => res.data);

	return { flow };
};
