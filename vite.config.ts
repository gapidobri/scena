import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import { createRequire } from 'module';
import path from 'path';

const require = createRequire(import.meta.url);

const prismaClient = require
	.resolve('@prisma/client')
	.replace(/@prisma(\/|\\)client(\/|\\)index\.js/, '.prisma/client/index-browser.js');

const prismaIndexBrowser = path.normalize(path.relative(process.cwd(), prismaClient));

const config: UserConfig = {
	plugins: [sveltekit()],
	resolve: { alias: { '.prisma/client/index-browser': prismaIndexBrowser } },
};

export default config;
