import { env } from '$env/dynamic/private';
import { logger } from '$lib/logger';
import prisma from '$lib/prisma';
import s3 from '$lib/s3';
import { createId } from '@paralleldrive/cuid2';

export type UploadWithUrl = { url: string | null } | null;

export async function uploadFile(file: File): Promise<string | null> {
	try {
		const key = `${createId()}-${file.name}`;

		await s3
			.putObject({
				Bucket: env.S3_BUCKET,
				Key: key,
				ACL: 'public-read',
				Body: Buffer.from(await file.arrayBuffer()),
			})
			.promise();

		const upload = await prisma.upload.create({
			data: {
				key,
				url: `${env.CDN_PUBLIC_URL}/${key}`,
			},
		});

		return upload.id;
	} catch (error) {
		logger.error('Failed to upload file', { error });
		return null;
	}
}
