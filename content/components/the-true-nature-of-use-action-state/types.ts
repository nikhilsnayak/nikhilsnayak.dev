export interface Todo {
  id: string;
  title: string;
  done: boolean;
}

export type TodoAction =
  | { type: 'add'; payload: { todo: Todo } }
  | { type: 'edit'; payload: { id: string; updatedTodo: Todo } }
  | { type: 'delete'; payload: { id: string } };
