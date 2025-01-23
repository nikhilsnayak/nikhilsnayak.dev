export function UserInput({
  action,
  isPending,
}: Readonly<{
  action: (formData: FormData) => void;
  isPending: boolean;
}>) {
  return (
    <form action={action} className='flex space-x-2 p-4'>
      <input
        type='text'
        name='query'
        required
        className='grow rounded-lg border border-gray-300 px-4 py-2 dark:bg-gray-700 dark:text-white'
      />
      <button
        type='submit'
        disabled={isPending}
        className='rounded-lg bg-purple-500 px-4 py-2 text-white'
      >
        Ask
      </button>
    </form>
  );
}
