[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnikhilsnayak%2Fnikhilsnayak.dev)

# [nikhilsnayak.dev](https://nikhilsnayak.dev)

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Components**: [Shadcn UI](https://ui.shadcn.com/)
- **LLM**: [OpenAI](https://platform.openai.com/)
- **Vector Store**: [Supabase](https://supabase.com/)
- **RAG**: [Langchain](https://js.langchain.com/v0.2/docs/tutorials/rag)
- **Database**: [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Auth**: [Auth.js](https://authjs.dev/)
- **Deployment**: [Vercel](https://vercel.com)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)

## Running Locally

This application requires Node.js v18.17+.

Create a `.env.local` file similar to [`.env.example`](./.env.example).

```bash
git clone https://github.com/nikhilsnayak/nikhilsnayak.dev.git <name-of-your-repo>
cd <name-of-your-repo>
bun install
bun run dev
```

## Vector Store Schema

Run the following sql in your supabase database

```sql
-- Enable the pgvector extension to work with embedding vectors
create extension vector;

-- Create a table to store your documents
create table documents (
  id bigserial primary key,
  content text, -- corresponds to Document.pageContent
  metadata jsonb, -- corresponds to Document.metadata
  embedding vector(1536) -- 1536 works for OpenAI embeddings, change if needed
);

-- Create a function to search for documents
create function match_documents (
  query_embedding vector(1536),
  match_count int DEFAULT null,
  filter jsonb DEFAULT '{}'
) returns table (
  id bigint,
  content text,
  metadata jsonb,
  embedding jsonb,
  similarity float
)
language plpgsql
as $$
#variable_conflict use_column
begin
  return query
  select
    id,
    content,
    metadata,
    (embedding::text)::jsonb as embedding,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where metadata @> filter
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;
```

Feel free to use this repository as a template. Please remove all of my personal information

- [CODE_OF_CONDUCT](./CODE_OF_CONDUCT.md)
- [CONTRIBUTING](./CONTRIBUTING.md)
- [License](./LICENSE)
- [SECURITY](./SECURITY.md)
