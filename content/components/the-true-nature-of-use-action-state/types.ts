export interface Todo {
  id: number;
  title: string;
  done: boolean;
}

export type TodoAction =
  | { type: 'add'; payload: { todo: Omit<Todo, 'id'> } }
  | { type: 'edit'; payload: { id: number; updatedTodo: Todo } }
  | { type: 'delete'; payload: { id: number } }
  | { type: 'set'; payload: Todo[] };
