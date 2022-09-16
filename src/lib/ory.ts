import { V0alpha2Api, Configuration } from '@ory/kratos-client';
import { KRATOS_URL } from '$env/static/private';

export const kratos = new V0alpha2Api(
	new Configuration({
		basePath: KRATOS_URL,
	}),
);
