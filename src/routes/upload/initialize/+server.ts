import { S3_BUCKET } from '$env/static/private';
import s3 from '$lib/s3';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

type RequestBody = {
	name: string;
};

export const POST: RequestHandler = async ({ request }) => {
	const body: RequestBody = await request.json();

	const upload = await s3
		.createMultipartUpload({
			Bucket: S3_BUCKET,
			Key: body.name,
			ACL: 'public-read',
		})
		.promise();

	console.log(upload);

	return json({
		fileId: upload.UploadId,
		fileKey: upload.Key,
	});
};
