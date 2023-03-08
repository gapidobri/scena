import { env } from '$env/dynamic/private';
import prisma from '$lib/prisma';
import s3 from '$lib/s3';
import { v4 as uuid } from 'uuid';

export async function uploadThumbnail(videoId: string, file: File) {
	const key = `${uuid()}-${file.name}`;

	await s3
		.putObject({
			Bucket: env.S3_BUCKET,
			Key: key,
			ACL: 'public-read',
			Body: Buffer.from(await file.arrayBuffer()),
		})
		.promise();

	await prisma.upload.create({
		data: {
			key,
			url: `${env.CDN_PUBLIC_URL}/${key}`,
			thumbnail: { connect: { id: videoId } },
		},
	});
}
