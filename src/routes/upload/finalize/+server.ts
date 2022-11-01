import { S3_BUCKET } from '$env/static/private';
import s3 from '$lib/s3';
import type { RequestHandler } from './$types';
import { orderBy } from 'lodash';
import { json } from '@sveltejs/kit';

type RequestBody = {
	fileId: string;
	fileKey: string;
	parts: {
		PartNumber: number;
		ETag: string;
	}[];
};

export const POST: RequestHandler = async ({ request }) => {
	const body: RequestBody = await request.json();

	console.log(body);

	const output = await s3
		.completeMultipartUpload({
			Bucket: S3_BUCKET,
			Key: body.fileKey,
			UploadId: body.fileId,
			MultipartUpload: {
				Parts: orderBy(body.parts, ['PartNumber'], ['asc']),
			},
		})
		.promise();

	return json({ url: output.Location });
};
