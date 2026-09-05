import Link from 'next/link';

export default function NotFound() {
  return (
    <section className='py-6 sm:py-10'>
      <h1 className='font-mono text-2xl font-medium tracking-tight'>Page not found</h1>
      <p className='text-muted-foreground mt-3 max-w-prose text-sm leading-relaxed'>
        This page may have moved or no longer exists.
      </p>
      <Link href='/' className='focus-ring mt-6 inline-block text-sm underline underline-offset-4'>
        Back to home
      </Link>
    </section>
  );
}
