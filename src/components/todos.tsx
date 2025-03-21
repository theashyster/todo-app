'use client';

import { deleteTodo, updateTodo } from '../services/api';
import { ApiResponse } from '../types';
import { APP_URL } from '../utils/constants';

export default function Todos({
  todos,
  filter,
  deleteItem
}: {
  todos: ApiResponse.Todo[];
  filter: string;
  deleteItem: () => void;
}) {
  const handleCompleteClick = async (todo: ApiResponse.Todo): Promise<void> => {
    await updateTodo(todo.id, { completed: !todo.completed })
      .then((_) => {})
      .catch((error) => {
        alert(error.message);
      });

    deleteItem();
  };

  const handleDeleteClick = async (id: number): Promise<void> => {
    await deleteTodo(id)
      .then((_) => {})
      .catch((error) => {
        alert(error.message);
      });

    deleteItem();
  };

  const filterCompleted = (todo: ApiResponse.Todo): boolean => {
    if (filter === 'all') {
      return true;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return !todo.completed;
  };

  const getTotalCost = (todos: ApiResponse.Todo[]): number => {
    return todos.reduce((total, todo) => total + (todo.cost ?? 0) + getTotalCost(todo.children), 0);
  };

  const filteredList = todos.filter(filterCompleted);
  const totalCost = getTotalCost(todos);

  return (
    <ul>
      {filteredList.length === 0 && <li className="no-todos">No items found!</li>}
      {filteredList.map((todo) => (
        <li key={todo.id}>
          <a className={todo.completed ? 'line-through' : ''} href={`${APP_URL}/list/${todo.id}`}>
            {todo.name} <span>{`${getTotalCost([todo])} EUR`}</span>
          </a>
          <button onClick={() => handleDeleteClick(todo.id)}>Delete</button>
          <button onClick={() => handleCompleteClick(todo)}>{todo.completed ? 'Reset' : 'Complete'}</button>
        </li>
      ))}
      <li className="total-cost">Total cost for all items: {totalCost} EUR</li>
    </ul>
  );
}
