import { type VercelPostgresFields } from '@langchain/community/vectorstores/vercel_postgres';

export const vectorStoreConfig: Omit<VercelPostgresFields, 'pool' | 'client'> =
  {
    tableName: 'documents',
    columns: {
      idColumnName: 'id',
      vectorColumnName: 'embedding',
      contentColumnName: 'content',
      metadataColumnName: 'metadata',
    },
  };
