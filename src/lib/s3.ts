import { S3 } from 'aws-sdk';
import {
	S3_ENDPOINT,
	S3_REGION,
	S3_ACCESS_KEY_ID,
	S3_SECRET_ACCESS_KEY,
} from '$env/static/private';

const s3 = new S3({
	endpoint: S3_ENDPOINT,
	region: S3_REGION,
	credentials: {
		accessKeyId: S3_ACCESS_KEY_ID,
		secretAccessKey: S3_SECRET_ACCESS_KEY,
	},
	s3ForcePathStyle: true,
});

export default s3;
