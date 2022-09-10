import { kratos } from '$lib/ory';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ request }) => {
	const flow = await kratos
		.createSelfServiceLogoutFlowUrlForBrowsers(request.headers.get('cookie') ?? undefined)
		.then((res) => res.data);

	throw redirect(301, flow.logout_url);
};
