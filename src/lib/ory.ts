import { V0alpha2Api, Configuration } from '@ory/kratos-client';

export const KRATOS_URL = 'http://localhost:4433';

export const kratos = new V0alpha2Api(
	new Configuration({
		basePath: KRATOS_URL,
	}),
);
