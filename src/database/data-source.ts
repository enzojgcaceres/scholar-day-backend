/**
 * DataSource usado pela CLI do TypeORM (migrations) e pelo seed.
 *
 *   npm run migration:generate --nome=AdicionaCampoX
 *   npm run migration:run
 *
 * Lê o `.env` (ou o arquivo em DOTENV_CONFIG_PATH).
 */
import 'dotenv/config';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { typeormOptions } from '../config/typeorm.options';

export default new DataSource({
  ...typeormOptions((k) => process.env[k]),
  // O esquema só muda por migration, nunca por sincronização.
  synchronize: false,
  // .ts com ts-node (local), .js no build (dist/), nunca os .d.ts.
  migrations: [
    join(__dirname, 'migrations', __filename.endsWith('.ts') ? '*.ts' : '*.js'),
  ],
  migrationsTransactionMode: 'all',
});
