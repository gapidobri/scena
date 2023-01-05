import { KRATOS_URL } from '$env/static/private';
import { kratos } from '$lib/ory';
import type { SelfServiceSettingsFlow } from '@ory/kratos-client';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

type OutputType = {
	flow?: SelfServiceSettingsFlow;
};

export const load: PageServerLoad<OutputType> = async ({ request, url }) => {
	const flowId = url.searchParams.get('flow');
	if (!flowId) {
		throw redirect(301, KRATOS_URL + '/self-service/settings/browser');
	}

	const flow = await kratos
		.getSelfServiceSettingsFlow(flowId, undefined, request.headers.get('cookie') ?? undefined)
		.then((res) => res.data);

	return { flow };
};
