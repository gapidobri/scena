import type { LayoutServerLoad } from './$types';

type OutputType = {
	auth: boolean;
};

export const load: LayoutServerLoad<OutputType> = async ({ locals }) => {
	return { auth: !!locals.session };
};
