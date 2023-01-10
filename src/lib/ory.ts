import { V0alpha2Api, Configuration } from '@ory/kratos-client';
import { env } from '$env/dynamic/private';

export const kratos = new V0alpha2Api(
	new Configuration({
		basePath: env.KRATOS_PRIVATE_URL,
	}),
);
