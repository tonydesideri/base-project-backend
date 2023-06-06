import { DataSource } from 'typeorm'
import * as dotenv from 'dotenv'
import { join } from 'path'

if (process.env.NODE_ENV === 'local') {
  dotenv.config({ path: './env/local.env' })
}

const config = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + './../../**/*.entity{.ts,.js}'],
  synchronize: false,
  schema: process.env.DATABASE_SCHEMA,
  migrationsRun: true,
  migrationsTableName: 'migrations',
  migrations: [
    join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'database',
      'migrations',
      '/**/*{.ts,.js}',
    ),
  ],
  // ssl: {
  //   rejectUnauthorized: false,
  // },
})

export default config
