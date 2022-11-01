import { S3_BUCKET } from '$env/static/private';
import prisma from '$lib/prisma';
import s3 from '$lib/s3';
import { error, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { v4 as uuid } from 'uuid';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const userId = locals.session?.identity.id;
		if (!userId) {
			throw error(401, 'Unauthorized');
		}

		const data = await request.formData();

		const title = data.get('title')?.toString();
		if (!title) return { message: 'Video title is missing' };

		const description = data.get('description')?.toString();

		const file = data.get('video') as File;

		const arrayBuffer = await file.arrayBuffer();

		const key = `${uuid()}-${file.name}`;

		const res = await s3.putObject({
			Bucket: S3_BUCKET,
			Key: key,
			Body: Buffer.from(arrayBuffer),
		});

		console.log(res);

		const video = await prisma.video.create({
			data: {
				title,
				description,
				user: { connect: { id: userId } },
				videoFile: { create: { key } },
				url: 'https://s3.eu-central-1.wasabisys.com/aerio-media/anime/no_game_no_life/[Judas]%20No%20Game%20No%20Life%20-%20S01E01.mp4',
				thumbnailUrl:
					'https://www.themoviedb.org/t/p/w500_and_h282_face/ceFPuGQYuZuHvTbj5icOvxUSPwS.jpg',
			},
		});

		throw redirect(301, `/video/${video.id}`);
	},
};
