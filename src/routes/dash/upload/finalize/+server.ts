import { env } from '$env/dynamic/private';
import s3 from '$lib/s3';
import type { RequestHandler } from './$types';
import _ from 'lodash';
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
			Bucket: env.S3_BUCKET,
			Key: body.fileKey,
			UploadId: body.fileId,
			MultipartUpload: {
				Parts: _.orderBy(body.parts, ['PartNumber'], ['asc']),
			},
		})
		.promise();

	const url = `${env.CDN_PUBLIC_URL}/${output.Key}`;

	await prisma.upload.update({
		where: { id: body.fileId },
		data: { url },
	});

	return json({ url });
};
