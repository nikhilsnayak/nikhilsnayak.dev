'use client';

import { ChevronDown, Ellipsis, Pencil, Trash2 } from 'lucide-react';
import {
  createContext,
  startTransition,
  use,
  useActionState,
  useOptimistic,
  useRef,
  type RefObject,
  useState,
} from 'react';
import { toast } from 'sonner';

import { List } from '~/components/list';
import { Spinner } from '~/components/spinner';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '~/components/ui/dropdown-menu';
import { Textarea } from '~/components/ui/textarea';
import { cn, formatDate } from '~/lib/utils';

import { addComment, deleteComment, editComment } from '../functions/mutations';
import { AddCommentSchema, DeleteCommentSchema, EditCommentSchema } from '../schema';
import type { Comment, CommentAuthor } from '../types';

type FormAction = (formData: FormData) => void;

type OptimisticComment = Comment & { isPending?: true };

interface CommentsManagerContext {
  comments: OptimisticComment[];
  user?: CommentAuthor | null;
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
  user?: CommentAuthor | null;
  slug: string;
}

export function CommentsManager({ initialComments, user, slug }: Readonly<CommentsManagerProps>) {
  const [state, dispatch] = useActionState(commentsReducer, initialComments);
  const [comments, setOptimisticComments] = useOptimistic<OptimisticComment[]>(state);

  const addCommentFormAction = (formData: FormData) => {
    const id = crypto.randomUUID();
    formData.append('id', id);

    const parsedResult = AddCommentSchema.safeParse(Object.fromEntries(formData));

    if (!parsedResult.success || !user?.id) {
      toast.error('Invalid data');
      return;
    }

    const newOptimisticComment: OptimisticComment = {
      ...parsedResult.data,
      replies: [],
      createdAt: new Date(),
      userId: user.id,
      user,
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
        return updateNestedReplies(prev, parentId, (parent) => ({
          ...parent,
          replies: parent.replies.map((reply) =>
            reply.id === id ? { ...reply, content, isPending: true } : reply,
          ),
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
        return updateNestedReplies(prev, parentId, (parent) => ({
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
        user,
        addCommentFormAction,
        deleteCommentFormAction,
        editCommentFormAction,
      }}
    >
      {user?.id ? <AddCommentControl slug={slug} /> : null}
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
  const { comments } = useCommentsManager();

  return (
    <List
      className='space-y-8'
      items={comments}
      emptyListFallback={
        <p className='border-border text-muted-foreground border-t py-6 font-mono text-xs'>
          No comments yet.
        </p>
      }
    >
      {(comment) => {
        return <CommentThread comment={comment} />;
      }}
    </List>
  );
}

function CommentThread({
  comment,
  nested = false,
}: Readonly<{ comment: OptimisticComment; nested?: boolean }>) {
  const { user } = useCommentsManager();
  const [editor, setEditor] = useState<'reply' | 'edit' | null>(null);
  const [showReplies, setShowReplies] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const replyTrigger = useRef<HTMLButtonElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);

  const closeEditor = () => {
    setEditor(null);
    (editor === 'reply' ? replyTrigger : menuTrigger).current?.focus();
  };

  return (
    <Collapsible
      open={showReplies}
      onOpenChange={setShowReplies}
      className='grid min-w-0 grid-cols-[1.5rem_minmax(0,1fr)] gap-x-3'
    >
      <Avatar className='mt-2 size-6 rounded-full grayscale'>
        <AvatarImage alt='' src={comment.user.image ?? ''} />
        <AvatarFallback className='font-mono text-[10px]'>
          {comment.user.name?.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className='min-w-0'>
        <div className='flex min-h-10 items-center justify-between gap-2'>
          <div className='flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-0.5'>
            <h3 className='min-w-0 text-sm font-medium wrap-anywhere'>{comment.user.name}</h3>
            <time
              dateTime={new Date(comment.createdAt).toISOString()}
              className='text-muted-foreground font-mono text-[10px]'
            >
              {formatDate(comment.createdAt)}
            </time>
          </div>
          {user?.id === comment.userId && !comment.isPending && (
            <DropdownMenu>
              <DropdownMenuTrigger
                ref={menuTrigger}
                aria-label={`Options for ${comment.user.name}’s comment`}
                className='focus-ring text-muted-foreground hover:text-foreground flex size-10 shrink-0 cursor-pointer items-center justify-center'
              >
                <Ellipsis className='size-4' aria-hidden='true' />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                finalFocus={editor === 'edit' || deleting ? false : undefined}
                className='bg-background w-36 border p-1'
              >
                <DropdownMenuItem
                  className='min-h-11 cursor-pointer gap-3 px-3'
                  onClick={() => setEditor('edit')}
                >
                  <Pencil className='size-3.5' aria-hidden='true' /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant='destructive'
                  className='min-h-11 cursor-pointer gap-3 px-3'
                  onClick={() => setDeleting(true)}
                >
                  <Trash2 className='size-3.5' aria-hidden='true' /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        {editor === 'edit' ? (
          <EditCommentControl
            commentId={comment.id}
            parentId={comment.parentId}
            content={comment.content}
            onClose={closeEditor}
          />
        ) : (
          <p className='text-sm leading-7 wrap-anywhere whitespace-pre-wrap'>{comment.content}</p>
        )}
        <div className='text-muted-foreground flex min-h-10 flex-wrap items-center gap-x-5 font-mono text-[11px]'>
          {comment.isPending ? (
            <output className='inline-flex items-center gap-1.5'>
              <Spinner className='size-3' /> saving
            </output>
          ) : (
            user?.id && (
              <Button
                variant='link'
                ref={replyTrigger}
                type='button'
                className='text-muted-foreground hover:text-foreground min-h-10 cursor-pointer px-0 font-mono text-[11px] font-normal underline-offset-4 hover:underline'
                aria-expanded={editor === 'reply'}
                onClick={() => (editor === 'reply' ? closeEditor() : setEditor('reply'))}
              >
                Reply
              </Button>
            )
          )}
          {comment.replies.length > 0 && (
            <CollapsibleTrigger className='focus-ring hover:text-foreground inline-flex min-h-10 cursor-pointer items-center gap-1.5 underline-offset-4 hover:underline'>
              <ChevronDown
                className={cn('size-3', showReplies && 'rotate-180')}
                aria-hidden='true'
              />
              {showReplies
                ? 'Hide replies'
                : `${comment.replies.length} ${comment.replies.length === 1 ? 'reply' : 'replies'}`}
            </CollapsibleTrigger>
          )}
        </div>
        {editor === 'reply' && (
          <AddReplyControl
            parentId={comment.id}
            slug={comment.slug}
            author={comment.user.name}
            onClose={closeEditor}
            onPost={() => {
              closeEditor();
              setShowReplies(true);
            }}
          />
        )}
        <DeleteCommentControl
          commentId={comment.id}
          parentId={comment.parentId}
          content={comment.content}
          isOpen={deleting}
          setIsOpen={setDeleting}
          returnFocusRef={menuTrigger}
        />
      </div>
      {comment.replies.length > 0 && (
        <CollapsibleContent className='col-span-2'>
          <div className={cn('pt-2', !nested && 'pl-3 sm:pl-9')}>
            <List
              className={cn('space-y-4', !nested && 'border-border/60 border-l pl-3 sm:pl-4')}
              items={comment.replies}
            >
              {(reply) => <CommentThread comment={reply} nested />}
            </List>
          </div>
        </CollapsibleContent>
      )}
    </Collapsible>
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
      className='mb-10 space-y-1'
    >
      <input type='text' name='slug' value={slug} hidden readOnly />
      <Textarea
        name='content'
        aria-label='Comment'
        placeholder='What’s on your mind?'
        className='max-h-80'
        required
        minLength={3}
      />
      <div className='flex items-center justify-end gap-4'>
        <Button
          variant='link'
          className='text-foreground decoration-foreground/35 min-h-11 px-0 text-xs font-normal underline underline-offset-4 hover:decoration-current'
          type='submit'
        >
          Post comment
        </Button>
      </div>
    </form>
  );
}

function EditCommentControl({
  commentId,
  content,
  parentId,
  onClose,
}: Readonly<{ commentId: string; content: string; parentId: string | null; onClose: () => void }>) {
  const { editCommentFormAction } = useCommentsManager();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onClose();
        const form = e.currentTarget;
        const formData = new FormData(form);
        form.reset();
        startTransition(() => {
          editCommentFormAction(formData);
        });
      }}
      className='mt-2 space-y-1'
    >
      <input type='text' name='id' value={commentId} hidden readOnly />
      {parentId && <input type='text' name='parentId' value={parentId} hidden readOnly />}
      <Textarea
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.stopPropagation();
            onClose();
          }
        }}
        ref={(element) => {
          element?.focus();
        }}
        name='content'
        aria-label='Edit comment'
        defaultValue={content}
        required
        minLength={3}
        className='max-h-80'
      />
      <div className='flex flex-wrap items-center justify-end gap-4'>
        <Button
          variant='link'
          type='button'
          onClick={onClose}
          className='text-muted-foreground hover:text-foreground min-h-11 cursor-pointer px-0 text-xs font-normal underline-offset-4 hover:underline'
        >
          Cancel
        </Button>
        <Button
          type='submit'
          variant='link'
          className='text-foreground decoration-foreground/35 min-h-11 px-0 font-normal underline underline-offset-4 hover:decoration-current'
        >
          Save changes
        </Button>
      </div>
    </form>
  );
}

function DeleteCommentControl({
  commentId,
  parentId,
  content,
  isOpen,
  setIsOpen,
  returnFocusRef,
}: Readonly<{
  commentId: string;
  parentId: string | null;
  content: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
}>) {
  const { deleteCommentFormAction } = useCommentsManager();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        finalFocus={returnFocusRef}
        className='max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-y-auto p-6 sm:p-8'
      >
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
          className='space-y-5'
        >
          <DialogHeader className='pr-5 text-left'>
            <DialogTitle className='text-lg font-medium tracking-tight'>
              Delete this comment?
            </DialogTitle>
            <DialogDescription>
              This comment and any replies will be removed. This can’t be undone.
            </DialogDescription>
          </DialogHeader>
          <input type='text' name='id' value={commentId} hidden readOnly />
          {parentId && <input type='text' name='parentId' value={parentId} hidden readOnly />}
          <blockquote className='border-border text-muted-foreground max-h-32 overflow-y-auto border-l pl-3.5 text-sm leading-7 wrap-anywhere whitespace-pre-wrap'>
            {content}
          </blockquote>
          <DialogFooter className='flex-row justify-end gap-3'>
            <DialogClose
              render={
                <Button
                  type='button'
                  variant='link'
                  className='text-muted-foreground hover:text-foreground min-h-11 px-0 font-normal'
                />
              }
            >
              Cancel
            </DialogClose>
            <Button type='submit' variant='destructive' className='min-h-11 px-4 font-normal'>
              Delete comment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AddReplyControl({
  parentId,
  slug,
  author,
  onClose,
  onPost,
}: Readonly<{
  parentId: string;
  slug: string;
  author: string;
  onClose: () => void;
  onPost: () => void;
}>) {
  const { addCommentFormAction } = useCommentsManager();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onPost();
        const form = e.currentTarget;
        const formData = new FormData(form);
        form.reset();
        startTransition(() => {
          addCommentFormAction(formData);
        });
      }}
      className='mt-1 mb-3 space-y-1'
    >
      <p className='text-muted-foreground mb-2 font-mono text-[11px]'>replying to {author}</p>
      <input type='text' name='slug' value={slug} hidden readOnly />
      <input type='text' name='parentId' value={parentId} hidden readOnly />
      <Textarea
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.stopPropagation();
            onClose();
          }
        }}
        ref={(element) => {
          element?.focus();
        }}
        name='content'
        aria-label={`Reply to ${author}`}
        placeholder='Your reply…'
        required
        minLength={3}
        className='max-h-80'
      />
      <div className='flex flex-wrap items-center justify-end gap-4'>
        <Button
          variant='link'
          type='button'
          onClick={onClose}
          className='text-muted-foreground hover:text-foreground min-h-11 cursor-pointer px-0 text-xs font-normal underline-offset-4 hover:underline'
        >
          Cancel
        </Button>
        <Button
          type='submit'
          variant='link'
          className='text-foreground decoration-foreground/35 min-h-11 px-0 font-normal underline underline-offset-4 hover:decoration-current'
        >
          Post reply
        </Button>
      </div>
    </form>
  );
}
