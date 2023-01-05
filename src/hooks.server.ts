import { kratos } from '$lib/ory';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('ory_kratos_session');

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
