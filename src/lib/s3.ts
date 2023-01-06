import { S3 } from 'aws-sdk';
import {
	S3_ENDPOINT,
	S3_REGION,
	S3_ACCESS_KEY_ID,
	S3_SECRET_ACCESS_KEY,
	S3_BUCKET,
	S3_EXPIRATION_TIME,
} from '$env/static/private';
import prisma from './prisma';
import moment from 'moment';
import { error } from '@sveltejs/kit';

const s3 = new S3({
	endpoint: S3_ENDPOINT,
	region: S3_REGION,
	credentials: {
		accessKeyId: S3_ACCESS_KEY_ID,
		secretAccessKey: S3_SECRET_ACCESS_KEY,
	},
	s3ForcePathStyle: true,
});

export async function getPrivateVideoUrl(uploadId: string, userId: string) {
	let url: string | null = null;

	const [upload, access] = await prisma.$transaction([
		prisma.upload.findUnique({ where: { id: uploadId } }),
		prisma.uploadAccessUrl.findUnique({
			where: { uploadId_userId: { uploadId, userId } },
		}),
	]);

	if (!upload) throw error(404, 'Not Found');

	if (!access || moment().isAfter(access.expirationDate)) {
		url = await s3.getSignedUrlPromise('getObject', {
			Bucket: S3_BUCKET,
			Key: upload.key,
			Expires: parseInt(S3_EXPIRATION_TIME),
		});
		const expirationDate = moment().add(S3_EXPIRATION_TIME, 'seconds').toDate();
		await prisma.uploadAccessUrl.upsert({
			where: { uploadId_userId: { uploadId, userId } },
			create: {
				uploadId,
				expirationDate,
				userId,
				url,
			},
			update: {
				expirationDate,
				url,
			},
		});
	} else {
		url = access.url;
	}

	return url;
}

export default s3;
