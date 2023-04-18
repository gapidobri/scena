import { env } from '$env/dynamic/private';
import { kratos } from '$lib/ory';
import { error, type Handle } from '@sveltejs/kit';

export const prerender = false;

export const handle: Handle = async ({ event, resolve }) => {
	if (event.route.id?.startsWith('/internal')) {
		const auth = event.request.headers.get('Authorization');
		if (!auth) throw error(401, 'Unauthorized');

		const token = auth.split('Bearer ')[1];
		if (token !== env.API_KEY) throw error(403, 'Forbidden');
	}

	try {
		event.locals.session = await kratos
			.toSession(undefined, event.request.headers.get('cookie') ?? undefined)
			.then((res) => res.data);
		event.locals.userId = event.locals.session?.identity.id ?? null;
	} catch (e) {
		// Unauthorized
	}

	return await resolve(event);
};
