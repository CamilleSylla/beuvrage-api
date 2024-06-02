import { config } from 'dotenv';
import { join } from 'path';
import { DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

config();

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgres://your_default_url', // Update the default URL as needed
  entities: ['dist/**/*.entity.{ts,js}'],
  synchronize: true,
  seeds: ['dist/database/seeder/*.js'],
  factories: ['dist/database/factories/*.js'],
};