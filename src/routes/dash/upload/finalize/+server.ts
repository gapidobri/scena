import { env } from '$env/dynamic/private';
import s3 from '$lib/s3';
import type { RequestHandler } from './$types';
import _ from 'lodash';
import { json } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { logger } from '$lib/logger';

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

	await prisma.$transaction([
		prisma.upload.update({
			where: { id: body.fileId },
			data: { url },
		}),
		prisma.transcodeJob.create({
			data: {
				video: {
					connect: {
						videoFileId: body.fileId,
					},
				},
			},
		}),
	]);

	logger.info('Completed video upload', { fileId: body.fileId, fileKey: body.fileKey });

	return json({ url });
};
