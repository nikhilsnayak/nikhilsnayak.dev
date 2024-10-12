import { toast } from 'sonner';

import { createTodo, deleteTodo, updateTodo } from './db/mutations';
import { useControlStore } from './store';
import { Todo, TodoAction } from './types';

export function todosReducer(state: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case 'add':
      return [action.payload.todo, ...state];
    case 'edit':
      return state.map((todo) => {
        if (todo.id === action.payload.id) {
          return action.payload.updatedTodo;
        }
        return todo;
      });
    case 'delete':
      return state.filter((todo) => todo.id !== action.payload.id);
    default:
      throw new Error('Invalid action type');
  }
}

export async function todosReducerAsync(
  state: Todo[],
  action: TodoAction
): Promise<Todo[]> {
  const { delay, shouldError } = useControlStore.getState();
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldError) {
        reject(
          new Error(
            `Network Error: Failed to ${action.type.toUpperCase()} todo`
          )
        );
      } else {
        resolve('success');
      }
    }, delay);
  });
  switch (action.type) {
    case 'add':
      const newTodo = await createTodo(action.payload.todo);
      return [newTodo, ...state];
    case 'edit':
      const updatedTodo = await updateTodo(
        action.payload.id,
        action.payload.updatedTodo
      );
      return state.map((todo) => {
        if (todo.id === action.payload.id) return updatedTodo;
        return todo;
      });
    case 'delete':
      const deletedId = await deleteTodo(action.payload.id);
      return state.filter((todo) => todo.id !== deletedId);
    default:
      throw new Error('Invalid action type');
  }
}

export async function todosReducerFinal(
  state: Todo[],
  action: TodoAction
): Promise<Todo[]> {
  try {
    const { delay, shouldError } = useControlStore.getState();
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldError) {
          reject(
            new Error(
              `Network Error: Failed to ${action.type.toUpperCase()} todo`
            )
          );
        } else {
          resolve('success');
        }
      }, delay);
    });
    switch (action.type) {
      case 'add':
        const newTodo = await createTodo(action.payload.todo);
        return [newTodo, ...state];
      case 'edit':
        const updatedTodo = await updateTodo(
          action.payload.id,
          action.payload.updatedTodo
        );
        return state.map((todo) => {
          if (todo.id === action.payload.id) return updatedTodo;
          return todo;
        });
      case 'delete':
        const deletedId = await deleteTodo(action.payload.id);
        return state.filter((todo) => todo.id !== deletedId);
      default:
        throw new Error('Invalid action type');
    }
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error('Something went wrong');
    }
    return state;
  }
}
