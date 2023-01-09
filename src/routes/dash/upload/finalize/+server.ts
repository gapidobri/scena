import { CDN_PUBLIC_URL, S3_BUCKET } from '$env/static/private';
import s3 from '$lib/s3';
import type { RequestHandler } from './$types';
import { orderBy } from 'lodash';
import { json } from '@sveltejs/kit';
import prisma from '$lib/prisma';

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

	const url = `${CDN_PUBLIC_URL}/${output.Key}`;

	await prisma.upload.update({
		where: { id: body.fileId },
		data: { url },
	});

	return json({ url });
};
