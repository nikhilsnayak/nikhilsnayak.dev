'use client';

import { Pencil, Reply, Trash2 } from 'lucide-react';
import {
  createContext,
  startTransition,
  use,
  useActionState,
  useOptimistic,
  useState,
} from 'react';
import { toast } from 'sonner';

import { List } from '~/components/list';
import { Spinner } from '~/components/spinner';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Textarea } from '~/components/ui/textarea';
import type { Session } from '~/lib/auth';
import { formatDate } from '~/lib/utils';

import { addComment, deleteComment, editComment } from '../functions/mutations';
import { AddCommentSchema, DeleteCommentSchema, EditCommentSchema } from '../schema';
import type { Comment } from '../types';

type FormAction = (formData: FormData) => void;

type OptimisticComment = Comment & { isPending?: true };

interface CommentsManagerContext {
  comments: OptimisticComment[];
  session?: Session | null;
  addCommentFormAction: FormAction;
  editCommentFormAction: FormAction;
  deleteCommentFormAction: FormAction;
}

const CommentsManagerContext = createContext<CommentsManagerContext | null>(null);

const updateNestedReplies = (
  comments: Comment[],
  parentId: string | null,
  callback: (comment: Comment) => Comment,
): Comment[] => {
  return comments.map((comment) => {
    if (comment.id === parentId) {
      return callback(comment);
    }
    if (comment.replies.length > 0) {
      return {
        ...comment,
        replies: updateNestedReplies(comment.replies, parentId, callback),
      };
    }
    return comment;
  });
};

async function commentsReducer(
  state: Comment[],
  { formData, type }: { formData: FormData; type: 'add' | 'edit' | 'delete' },
): Promise<Comment[]> {
  switch (type) {
    case 'add': {
      const res = await addComment(formData);
      if ('error' in res) {
        toast.error(res.error);
        return state;
      }

      const newComment: Comment = {
        ...res,
        replies: [],
      };

      if (res.parentId === null) {
        return [newComment, ...state];
      } else {
        return updateNestedReplies(state, res.parentId, (parent) => ({
          ...parent,
          replies: [newComment, ...parent.replies],
        }));
      }
    }

    case 'edit': {
      const res = await editComment(formData);
      if ('error' in res) {
        toast.error(res.error);
        return state;
      }

      if (res.parentId === null) {
        return state.map((comment) =>
          comment.id === res.id
            ? {
                ...comment,
                ...res,
              }
            : comment,
        );
      } else {
        return updateNestedReplies(state, res.parentId, (parent) => ({
          ...parent,
          replies: parent.replies.map((reply) =>
            reply.id === res.id ? { ...reply, ...res } : reply,
          ),
        }));
      }
    }

    case 'delete': {
      const res = await deleteComment(formData);
      if ('error' in res) {
        toast.error(res.error);
        return state;
      }

      if (res.parentId === null) {
        return state.filter((comment) => comment.id !== res.id);
      } else {
        return updateNestedReplies(state, res.parentId, (parent) => ({
          ...parent,
          replies: parent.replies.filter((reply) => reply.id !== res.id),
        }));
      }
    }

    default:
      return state;
  }
}

interface CommentsManagerProps {
  initialComments: Comment[];
  session?: Session | null;
  slug: string;
}

export function CommentsManager({
  initialComments,
  session,
  slug,
}: Readonly<CommentsManagerProps>) {
  const [state, dispatch] = useActionState(commentsReducer, initialComments);
  const [comments, setOptimisticComments] = useOptimistic<OptimisticComment[]>(state);

  const addCommentFormAction = (formData: FormData) => {
    const id = crypto.randomUUID();
    formData.append('id', id);

    const parsedResult = AddCommentSchema.safeParse(Object.fromEntries(formData));

    if (!parsedResult.success || !session?.user?.id) {
      toast.error('Invalid data');
      return;
    }

    const newOptimisticComment: OptimisticComment = {
      ...parsedResult.data,
      replies: [],
      createdAt: new Date(),
      userId: session.user.id,
      user: session.user,
      isPending: true,
    };

    setOptimisticComments((prev) => {
      if (newOptimisticComment.parentId === null) {
        return [newOptimisticComment, ...prev];
      } else {
        return updateNestedReplies(prev, newOptimisticComment.parentId, (parent) => ({
          ...parent,
          replies: [newOptimisticComment, ...parent.replies],
        }));
      }
    });
    dispatch({ type: 'add', formData });
  };

  const editCommentFormAction = (formData: FormData) => {
    const parsedResult = EditCommentSchema.safeParse(Object.fromEntries(formData));

    if (!parsedResult.success) {
      toast.error('Invalid data');
      return;
    }
    const { content, id, parentId } = parsedResult.data;

    setOptimisticComments((prev) => {
      if (parentId === null) {
        return prev.map((comment) => {
          if (comment.id === id) return { ...comment, content, isPending: true };
          return comment;
        });
      } else {
        return updateNestedReplies(state, parentId, (parent) => ({
          ...parent,
          replies: parent.replies.map((reply) => (reply.id === id ? { ...reply, content } : reply)),
        }));
      }
    });
    dispatch({ type: 'edit', formData });
  };

  const deleteCommentFormAction = (formData: FormData) => {
    const parsedResult = DeleteCommentSchema.safeParse(Object.fromEntries(formData));

    if (!parsedResult.success) {
      toast.error('Invalid data');
      return;
    }
    const { id, parentId } = parsedResult.data;

    setOptimisticComments((prev) => {
      if (parentId === null) {
        return prev.filter((comment) => comment.id !== id);
      } else {
        return updateNestedReplies(state, parentId, (parent) => ({
          ...parent,
          replies: parent.replies.filter((reply) => reply.id !== id),
        }));
      }
    });
    dispatch({ type: 'delete', formData });
  };

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
    throw new Error('useCommentsManager must be used inside CommentsManagerContext');
  }
  return context;
}

function CommentsList() {
  const { comments, session } = useCommentsManager();

  return (
    <List
      className='space-y-6 overflow-hidden'
      items={comments}
      emptyListFallback={
        session?.user ? <p className='text-muted-foreground text-sm'>No comments yet.</p> : null
      }
    >
      {(comment) => {
        return <CommentThread comment={comment} />;
      }}
    </List>
  );
}

function CommentThread({ comment }: Readonly<{ comment: OptimisticComment }>) {
  const { session } = useCommentsManager();

  return (
    <div className='py-2'>
      <div className='flex flex-col items-start justify-between sm:flex-row'>
        <div className='flex min-w-0 items-start gap-3'>
          <Avatar className='size-8'>
            <AvatarImage alt={comment.user.name ?? ''} src={comment.user.image ?? ''} />
            <AvatarFallback>{comment.user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className='flex flex-wrap items-center gap-2 text-sm'>
              <span className='font-medium wrap-anywhere'>{comment.user.name}</span>
              {session?.user?.id === comment.userId && (
                <span className='text-muted-foreground text-xs'>you</span>
              )}
              {comment.isPending && <Spinner className='size-4' />}
            </h3>
            <time
              dateTime={new Date(comment.createdAt).toISOString()}
              className='text-muted-foreground text-xs'
            >
              {formatDate(comment.createdAt)}
            </time>
          </div>
        </div>
        {session?.user?.id && !comment.isPending && (
          <div className='text-muted-foreground mt-2 flex items-center gap-1 sm:mt-0'>
            <AddReplyControl parentId={comment.id} slug={comment.slug} />
            {session.user.id === comment.userId && (
              <>
                <EditCommentControl
                  content={comment.content}
                  commentId={comment.id}
                  parentId={comment.parentId}
                />
                <DeleteCommentControl commentId={comment.id} parentId={comment.parentId} />
              </>
            )}
          </div>
        )}
      </div>
      <p className='mt-2 pl-11 text-sm leading-relaxed wrap-break-word'>{comment.content}</p>

      {comment.replies.length > 0 && (
        <List
          className='border-border/60 mt-4 w-full space-y-4 overflow-hidden border-l pl-4'
          items={comment.replies}
        >
          {(reply) => {
            return <CommentThread comment={reply} />;
          }}
        </List>
      )}
    </div>
  );
}

function AddCommentControl({ slug }: Readonly<{ slug: string }>) {
  const { addCommentFormAction } = useCommentsManager();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        form.reset();
        startTransition(() => {
          addCommentFormAction(formData);
        });
      }}
      className='flex flex-col gap-2'
    >
      <input type='text' name='slug' value={slug} hidden readOnly />
      <Textarea
        name='content'
        aria-label='Comment'
        placeholder='Write a comment...'
        className='min-h-24 text-sm md:text-sm dark:bg-transparent'
        required
        minLength={3}
      />
      <Button variant='outline' className='self-end' type='submit'>
        Post comment
      </Button>
    </form>
  );
}

function EditCommentControl({
  commentId,
  content,
  parentId,
}: Readonly<{ commentId: string; content: string; parentId: string | null }>) {
  const { editCommentFormAction } = useCommentsManager();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button size='icon' variant='ghost' aria-label='Edit comment' title='Edit comment'>
            <Pencil className='size-3.5' />
          </Button>
        }
      />
      <DialogContent className='w-4/5'>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsOpen(false);
            const form = e.currentTarget;
            const formData = new FormData(form);
            form.reset();
            startTransition(() => {
              editCommentFormAction(formData);
            });
          }}
          className='space-y-4'
        >
          <DialogHeader>
            <DialogTitle>Edit Comment</DialogTitle>
          </DialogHeader>
          <input type='text' name='id' value={commentId} hidden readOnly />
          {parentId && <input type='text' name='parentId' value={parentId} hidden readOnly />}
          <Textarea
            name='content'
            placeholder='Write a comment...'
            required
            minLength={3}
            defaultValue={content}
          />
          <DialogFooter>
            <Button type='submit'>Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteCommentControl({
  commentId,
  parentId,
}: Readonly<{ commentId: string; parentId: string | null }>) {
  const { deleteCommentFormAction } = useCommentsManager();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button
            size='icon'
            variant='ghost'
            aria-label='Delete comment'
            title='Delete comment'
            className='text-destructive hover:text-destructive'
          >
            <Trash2 className='size-3.5' />
          </Button>
        }
      />
      <DialogContent className='w-4/5'>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsOpen(false);
            const form = e.currentTarget;
            const formData = new FormData(form);
            form.reset();
            startTransition(() => {
              deleteCommentFormAction(formData);
            });
          }}
          className='space-y-4'
        >
          <DialogHeader>
            <DialogTitle>Delete Comment</DialogTitle>
          </DialogHeader>
          <input type='text' name='id' value={commentId} hidden readOnly />
          {parentId && <input type='text' name='parentId' value={parentId} hidden readOnly />}
          <p>Are you sure you want to delete this comment?</p>
          <DialogFooter>
            <Button type='submit' variant='destructive'>
              Continue
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AddReplyControl({ parentId, slug }: Readonly<{ parentId: string; slug: string }>) {
  const { addCommentFormAction } = useCommentsManager();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button size='icon' variant='ghost' aria-label='Reply to comment' title='Reply'>
            <Reply className='size-3.5' />
          </Button>
        }
      />
      <DialogContent className='w-4/5'>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setIsOpen(false);
            const form = e.currentTarget;
            const formData = new FormData(form);
            form.reset();
            startTransition(() => {
              addCommentFormAction(formData);
            });
          }}
          className='space-y-4'
        >
          <DialogHeader>
            <DialogTitle>Add Reply</DialogTitle>
          </DialogHeader>
          <input type='text' name='slug' value={slug} hidden readOnly />
          <input type='text' name='parentId' value={parentId} hidden readOnly />
          <Textarea name='content' placeholder='Write a reply...' required minLength={3} />
          <DialogFooter>
            <Button type='submit'>Reply</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
