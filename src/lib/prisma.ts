// import type { PrismaClient as ImportedPrismaClient } from '@prisma/client';
// import { createRequire } from 'module';

import { PrismaClient } from '@prisma/client';

// const require = createRequire(import.meta.url ?? __filename);
// const { PrismaClient: RequiredPrismaClient } = require('@prisma/client');
// const _PrismaClient: typeof ImportedPrismaClient = RequiredPrismaClient;
// class PrismaClient extends _PrismaClient {}

const prisma = new PrismaClient();

export default prisma;
