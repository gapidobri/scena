import { kratos } from '$lib/ory';
import type { PageServerLoad } from './$types';
import type { SelfServiceLoginFlow } from '@ory/kratos-client';
import { redirect } from '@sveltejs/kit';
import { KRATOS_URL } from '$env/static/private';

type OutputType = {
	flow?: SelfServiceLoginFlow;
};

export const load: PageServerLoad<OutputType> = async ({ request, url }) => {
	const flowId = url.searchParams.get('flow');
	if (!flowId) {
		throw redirect(301, KRATOS_URL + '/self-service/login/browser');
	}

	const flow = await kratos
		.getSelfServiceLoginFlow(flowId, request.headers.get('cookie') ?? undefined)
		.then((res) => res.data);

	return { flow };
};
