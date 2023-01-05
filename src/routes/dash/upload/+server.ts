import { S3_BUCKET } from '$env/static/private';
import prisma from '$lib/prisma';
import s3 from '$lib/s3';
import { v4 as uuid } from 'uuid';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

type RequestBody = {
	name: string;
};

export const POST: RequestHandler = async ({ request, locals: { userId } }) => {
	if (!userId) {
		throw error(401, 'Unauthorized');
	}

	const body: RequestBody = await request.json();

	const { Key: key, UploadId: uploadId } = await s3
		.createMultipartUpload({
			Bucket: S3_BUCKET,
			Key: `${uuid()}-${body.name}`,
			ACL: 'public-read',
		})
		.promise();
	if (!key || !uploadId) {
		throw error(500, 'Internal server error');
	}

	const video = await prisma.video.create({
		data: {
			user: { connect: { id: userId } },
			videoFile: {
				create: {
					id: uploadId,
					key,
				},
			},
		},
		select: { id: true },
	});

	return json({
		fileId: uploadId,
		fileKey: key,
		videoId: video.id,
	});
};
