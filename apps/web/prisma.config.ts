import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'src/lib/prisma/schema.prisma',
  migrations: {
    path: 'src/lib/prisma/migrations',
  },
  engine: 'classic',
  datasource: {
    url: process.env.MONGODB_URI || '',
  },
});
