import { env } from '$env/dynamic/private';
import s3 from '$lib/s3';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { logger } from '$lib/logger';

type RequestBody = {
	fileKey: string;
	fileId: string;
	parts: number;
};

export const POST: RequestHandler = async ({ request }) => {
	const body: RequestBody = await request.json();

	const promises = [];
	for (let index = 0; index < body.parts; index++) {
		promises.push(
			s3.getSignedUrlPromise('uploadPart', {
				Bucket: env.S3_BUCKET,
				Key: body.fileKey,
				UploadId: body.fileId,
				PartNumber: index + 1,
			}),
		);
	}

	const signedUrls = await Promise.all(promises);
	const partSignedUrlList = signedUrls.map((signedUrl, index) => ({
		signedUrl,
		PartNumber: index + 1,
	}));

	logger.info('Generated signed URLs for upload', { fileId: body.fileId, fileKey: body.fileKey });

	return json({
		parts: partSignedUrlList,
	});
};
