import { createTodo, deleteTodo, updateTodo } from './db/mutations';
import { Todo, TodoAction } from './types';

export function todosReducer(state: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case 'add':
      const id = Math.floor(Math.random() * 1000);
      return [
        {
          id,
          ...action.payload.todo,
        },
        ...state,
      ];
    case 'edit':
      return state.map((todo) => {
        if (todo.id === action.payload.id) return action.payload.updatedTodo;
        return todo;
      });
    case 'delete':
      return state.filter((todo) => todo.id !== action.payload.id);
    case 'set':
      return action.payload;
    default:
      return state;
  }
}

export async function todosReducerAsync(
  state: Todo[],
  action: TodoAction
): Promise<Todo[]> {
  switch (action.type) {
    case 'add':
      const newTodo = await createTodo(action.payload.todo);
      return [newTodo, ...state];
    case 'edit':
      // await new Promise((resolve) => setTimeout(resolve, 3000));
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
    case 'set':
      return action.payload;
    default:
      return state;
  }
}
