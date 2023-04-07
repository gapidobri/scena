import { env } from '$env/dynamic/private';
import prisma from '$lib/prisma';
import s3 from '$lib/s3';
import { createId } from '@paralleldrive/cuid2';
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
			Bucket: env.S3_BUCKET,
			Key: `${createId()}-${body.name}`,
		})
		.promise();
	if (!key || !uploadId) {
		throw error(500, 'Internal server error');
	}

	const video = await prisma.video.create({
		data: {
			user: { connect: { id: userId } },
			title: body.name,
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
