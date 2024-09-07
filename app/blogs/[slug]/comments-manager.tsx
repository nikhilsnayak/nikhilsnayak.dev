'use client';

import {
  ComponentRef,
  createContext,
  startTransition,
  use,
  useActionState,
  useCallback,
  useOptimistic,
  useRef,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';
import type { Session } from 'next-auth';
import { toast } from 'sonner';

import {
  addCommentSchema,
  deleteCommentSchema,
  editCommentSchema,
} from '~/lib/db/schema';
import { formatDate } from '~/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Textarea } from '~/components/ui/textarea';

import { addComment, deleteComment, editComment } from './actions';
import { CommentWithUser } from './types';

type FormAction = (formData: FormData) => void;

type OptimisticCommentWithUser = CommentWithUser & { isPending?: true };

interface CommentsManagerContext {
  comments: OptimisticCommentWithUser[];
  session?: Session | null;
  addCommentFormAction: FormAction;
  editCommentFormAction: FormAction;
  deleteCommentFormAction: FormAction;
}

const CommentsManagerContext = createContext<CommentsManagerContext | null>(
  null
);

async function commentsAction(
  state: CommentWithUser[],
  { formData, type }: { formData: FormData; type: 'add' | 'edit' | 'delete' }
) {
  switch (type) {
    case 'add': {
      const res = await addComment(formData);
      if ('error' in res) {
        toast.error(res.error);
        return state;
      }
      return [res, ...state];
    }

    case 'edit': {
      const res = await editComment(formData);
      if ('error' in res) {
        toast.error(res.error);
        return state;
      }
      return state.map((comment) => {
        if (comment.id === res.id) return res;
        return comment;
      });
    }

    case 'delete': {
      const res = await deleteComment(formData);
      if ('error' in res) {
        toast.error(res.error);
        return state;
      }
      return state.filter((comment) => comment.id !== res.id);
    }

    default:
      return state;
  }
}

interface CommentsManagerProps {
  initialCommentsPromise: Promise<CommentWithUser[]>;
  session?: Session | null;
  slug: string;
}

export function CommentsManager({
  initialCommentsPromise,
  session,
  slug,
}: CommentsManagerProps) {
  const initialComments = use(initialCommentsPromise);
  const [state, formAction] = useActionState(commentsAction, initialComments);
  const [comments, setOptimisticComments] =
    useOptimistic<OptimisticCommentWithUser[]>(state);

  const addCommentFormAction = useCallback(
    (formData: FormData) => {
      const id = crypto.randomUUID();
      formData.append('id', id);

      const parsedResult = addCommentSchema.safeParse(
        Object.fromEntries(formData)
      );

      if (!parsedResult.success || !session?.user?.id) {
        toast.error('Invalid data');
        return;
      }
      const { content, slug } = parsedResult.data;

      const newOptimisticComment: OptimisticCommentWithUser = {
        id,
        content,
        slug,
        createdAt: new Date(),
        userId: session.user.id,
        user: session.user,
        isPending: true,
      };

      setOptimisticComments((prev) => [newOptimisticComment, ...prev]);

      formAction({ type: 'add', formData });
    },
    [formAction, setOptimisticComments, session?.user]
  );

  const editCommentFormAction = useCallback(
    (formData: FormData) => {
      const parsedResult = editCommentSchema.safeParse(
        Object.fromEntries(formData)
      );

      if (!parsedResult.success) {
        toast.error('Invalid data');
        return;
      }
      const { content, id } = parsedResult.data;

      setOptimisticComments((prev) =>
        prev.map((comment) => {
          if (comment.id === id)
            return { ...comment, content, isPending: true };
          return comment;
        })
      );

      formAction({ type: 'edit', formData });
    },
    [formAction, setOptimisticComments]
  );

  const deleteCommentFormAction = useCallback(
    (formData: FormData) => {
      const parsedResult = deleteCommentSchema.safeParse(
        Object.fromEntries(formData)
      );

      if (!parsedResult.success) {
        toast.error('Invalid data');
        return;
      }
      const { id } = parsedResult.data;

      setOptimisticComments((prev) =>
        prev.filter((comment) => comment.id !== id)
      );

      formAction({ type: 'delete', formData });
    },
    [formAction, setOptimisticComments]
  );

  return (
    <CommentsManagerContext
      value={{
        comments,
        session,
        addCommentFormAction,
        deleteCommentFormAction,
        editCommentFormAction,
      }}
    >
      {session?.user?.id ? <AddCommentControl slug={slug} /> : null}
      <CommentsList />
    </CommentsManagerContext>
  );
}

function useCommentsManager() {
  const context = use(CommentsManagerContext);
  if (context === null) {
    throw new Error(
      'useCommentsManager must be used inside CommentsManagerContext'
    );
  }
  return context;
}

function CommentsList() {
  const { comments, session } = useCommentsManager();

  return (
    <AnimatePresence initial={false}>
      {comments.length === 0 ? (
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          No comments yet.
        </motion.p>
      ) : (
        <motion.ul
          layout
          className='max-w-sm overflow-hidden'
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{
            layout: {
              type: 'spring',
            },
          }}
        >
          <AnimatePresence initial={false}>
            {comments.map((comment) => (
              <motion.li
                key={comment.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  opacity: { duration: 0.3 },
                }}
              >
                <div className='py-4'>
                  <div className='flex justify-between items-center'>
                    <div className='flex gap-2'>
                      <Avatar className='h-10 w-10 border'>
                        <AvatarImage
                          alt={comment.user.name ?? ''}
                          src={comment.user.image ?? ''}
                        />
                        <AvatarFallback>
                          {comment.user.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className=' flex items-center gap-2'>
                          <span className='font-bold'>{comment.user.name}</span>
                          {session?.user?.id === comment.userId ? (
                            <span className='text-[10px] bg-muted-foreground rounded py-0.5 px-1'>
                              You
                            </span>
                          ) : null}
                        </h3>
                        <span className='text-sm text-neutral-600 dark:text-neutral-400'>
                          {formatDate(comment.createdAt.toISOString())}
                        </span>
                      </div>
                    </div>
                    {session?.user?.id === comment.userId &&
                    !comment.isPending ? (
                      <div className='flex items-center gap-2'>
                        <EditCommentControl
                          content={comment.content}
                          commentId={comment.id}
                        />
                        <DeleteCommentControl commentId={comment.id} />
                      </div>
                    ) : null}
                  </div>
                  <p className='mt-2'>{comment.content}</p>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </AnimatePresence>
  );
}

export function AddCommentControl({ slug }: Readonly<{ slug: string }>) {
  const { addCommentFormAction } = useCommentsManager();
  const formRef = useRef<ComponentRef<'form'>>(null!);
  return (
    <form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formRef.current.reset();
        startTransition(() => {
          addCommentFormAction(formData);
        });
      }}
      className='flex flex-col gap-2'
    >
      <input type='text' name='slug' value={slug} hidden readOnly />
      <Textarea
        name='content'
        placeholder='Write a comment...'
        required
        minLength={3}
      />
      <Button className='self-end'>Comment</Button>
    </form>
  );
}

function EditCommentControl({
  commentId,
  content,
}: Readonly<{ commentId: string; content: string }>) {
  const { editCommentFormAction } = useCommentsManager();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='icon' variant='ghost'>
          <Pencil className='text-blue-400 size-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='w-4/5 rounded-sm'>
        <form action={editCommentFormAction} className='space-y-4'>
          <DialogHeader>
            <DialogTitle>Edit Comment</DialogTitle>
          </DialogHeader>
          <input type='text' name='id' value={commentId} hidden readOnly />
          <Textarea
            name='content'
            placeholder='Write a comment...'
            required
            minLength={3}
            defaultValue={content}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type='submit'>Save changes</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteCommentControl({ commentId }: Readonly<{ commentId: string }>) {
  const { deleteCommentFormAction } = useCommentsManager();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='icon' variant='ghost'>
          <Trash2 className='text-red-400  size-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='w-4/5 rounded-sm'>
        <form action={deleteCommentFormAction} className='space-y-4'>
          <DialogHeader>
            <DialogTitle>Delete Comment</DialogTitle>
          </DialogHeader>
          <input type='text' name='id' value={commentId} hidden readOnly />
          <p>Are you sure you want to delete this comment?</p>
          <DialogFooter>
            <DialogClose asChild>
              <Button type='submit' variant='destructive'>
                Continue
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
