import { kratos, KRATOS_URL } from '$lib/ory';
import type { PageServerLoad } from './$types';
import type { SelfServiceRegistrationFlow } from '@ory/kratos-client';
import { redirect } from '@sveltejs/kit';

type OutputType = {
	flow?: SelfServiceRegistrationFlow;
};

export const load: PageServerLoad<OutputType> = async ({ request, url }) => {
	const flowId = url.searchParams.get('flow');
	if (!flowId) {
		throw redirect(301, KRATOS_URL + '/self-service/registration/browser');
	}

	const flow = await kratos
		.getSelfServiceRegistrationFlow(flowId, request.headers.get('cookie') ?? undefined)
		.then((res) => res.data);

	return { flow };
};
