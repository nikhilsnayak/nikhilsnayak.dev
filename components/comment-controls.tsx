'use client';
import { Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { useState, useTransition } from 'react';
import { editComment, deleteComment } from '@/lib/actions/comments';
import { LoadingSpinner } from '@/assets/icons';
import { Comment } from '@/lib/db/schema';

interface CommentControlsProps {
  comment: Comment;
}

export function EditCommentControl({ comment }: CommentControlsProps) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [isUpdating, startUpdating] = useTransition();
  const [error, setError] = useState('');

  const handleCommentUpdate = () => {
    if (content.trim().length < 3) {
      setError('Comment must be min. 3 characters');
      return;
    }

    startUpdating(async () => {
      const actionError = await editComment({ ...comment, content });
      if (actionError) {
        setError(actionError);
      } else {
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='icon' variant='ghost'>
          <Pencil className='text-blue-400' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit Comment</DialogTitle>
        </DialogHeader>
        <Textarea
          placeholder='Write a comment...'
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {error && <p className='text-red-500'>{error}</p>}
        <DialogFooter>
          <Button
            onClick={handleCommentUpdate}
            disabled={isUpdating || content.trim() === comment.content.trim()}
            className='flex items-center gap-2'
          >
            <span>Save changes</span>
            {isUpdating ? <LoadingSpinner className='fill-background' /> : null}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteCommentControl({ comment }: CommentControlsProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, startDeleting] = useTransition();
  const [error, setError] = useState('');

  const handleCommentDelete = () => {
    startDeleting(async () => {
      const actionError = await deleteComment(comment.id);
      if (actionError) {
        setError(actionError);
      } else {
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='icon' variant='ghost'>
          <Trash2 className='text-red-400' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Delete Comment</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete this comment?</p>
        {error && <p className='text-red-500'>{error}</p>}
        <DialogFooter>
          <Button
            variant='destructive'
            onClick={handleCommentDelete}
            disabled={isDeleting}
            className='flex items-center gap-2'
          >
            <span>Continue</span>
            {isDeleting ? <LoadingSpinner className='fill-background' /> : null}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
