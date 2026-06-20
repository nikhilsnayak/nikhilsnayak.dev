[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnikhilsnayak%2Fnikhilsnayak.dev)

# [nikhilsnayak.dev](https://nikhilsnayak.dev)

## Overview

- **Package Manager**: [Bun](https://bun.sh)
- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Design System**: [shadcn/ui](https://ui.shadcn.com/) with [Base UI](https://base-ui.com/)
- **Database**: [Neon](https://neon.tech/home) in production, local [Postgres](https://www.postgresql.org/) via Docker in development
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Auth**: [Better Auth](https://www.better-auth.com/)
- **Linting & Formatting**: [oxlint](https://oxc.rs/docs/guide/usage/linter) & [oxfmt](https://oxc.rs/docs/guide/usage/formatter)
- **Deployment**: [Vercel](https://vercel.com)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)

## Running Locally

1. Clone the repository and navigate to the directory:

   ```bash
   git clone https://github.com/nikhilsnayak/nikhilsnayak.dev.git <your-repo-name>
   cd <your-repo-name>
   ```

2. Install the dependencies using [Bun](https://bun.sh):

   ```bash
   bun install
   ```

3. Create a `.env` file based on the [`.env.example`](./.env.example) file.

4. Start the local database (Postgres + Neon proxy) using Docker:

   ```bash
   docker compose up -d
   ```

5. Apply the database schema:

   ```bash
   bun run db:push
   ```

6. Start the development server:

   ```bash
   bun run dev
   ```

Feel free to use this repository as a template. Ensure to remove any personal information.
