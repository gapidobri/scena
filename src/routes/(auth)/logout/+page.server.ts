import { kratos } from '$lib/ory';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ request, url }) => {
	const flow = await kratos
		.createSelfServiceLogoutFlowUrlForBrowsers(request.headers.get('cookie') ?? undefined)
		.then((res) => res.data);

	const returnTo = url.searchParams.get('return_to') ?? '/';

	throw redirect(301, `${flow.logout_url}&return_to=${returnTo}`);
};
