import { env } from './env';

const DOCUMENT_TABLE = 'documents';

export const vectorStoreConfig = {
  tableName: DOCUMENT_TABLE,
  postgresConnectionOptions: {
    connectionString: env.POSTGRES_URL,
  },
  columns: {
    idColumnName: 'id',
    vectorColumnName: 'embedding',
    contentColumnName: 'content',
    metadataColumnName: 'metadata',
  },
};
