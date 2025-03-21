import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Form from './components/form';
import Todos from './components/todos';
import { getTodo, getTodos } from './services/api';
import { socket } from './services/socket';
import { ApiResponse } from './types';

function App() {
  const params = useParams();
  const id = params.id ? Number(params.id) : undefined;

  useEffect(() => {
    socket.on('item-added', refreshTodos);
    socket.on('item-deleted', refreshTodos);
    socket.on('item-updated', refreshTodo);

    return () => {
      socket.off('item-added', refreshTodos);
      socket.off('item-deleted', refreshTodos);
      socket.off('item-updated', refreshTodo);
    };
  }, []);

  const [todo, setTodo] = useState<ApiResponse.Todo>({} as ApiResponse.Todo);

  if (id) {
    useEffect(() => {
      let ignore = false;

      getTodo(id).then((todo) => {
        if (!ignore) {
          setTodo(todo);
        }
      });

      return () => {
        ignore = true;
      };
    }, []);
  }

  const [todos, setTodos] = useState<ApiResponse.Todo[]>([]);

  useEffect(() => {
    let ignore = false;

    getTodos(id).then((todos) => {
      if (!ignore) {
        setTodos(todos);
      }
    });

    return () => {
      ignore = true;
    };
  }, []);

  const addItem = (): void => {
    socket.emit('add-item');
  };

  const updateItem = (): void => {
    socket.emit('update-item');
  };

  const deleteItem = (): void => {
    socket.emit('delete-item');
  };

  const refreshTodo = async (): Promise<void> => {
    getTodo(id!).then((todo) => {
      setTodo(todo);
    });

    getTodos(id).then((todos) => {
      setTodos(todos);
    });
  };

  const refreshTodos = async (): Promise<void> => {
    getTodos(id).then((todos) => {
      setTodos(todos);
    });
  };

  const [filter, setFilter] = useState('all');

  return (
    <div>
      <main>
        <h1>TODO app</h1>
        <div hidden={!id}>
          <a href={todo.parentId ? `/list/${todo.parentId}` : '/'}>Back to parent</a>
          <p>Edit item</p>
          <Form todo={todo} updateItem={updateItem} />
        </div>
        <div>
          <p>Add item</p>
          <Form parentId={id} addItem={addItem} />
        </div>
        <div hidden={todos.length === 0}>
          <h2>Items</h2>
          <label>
            Filter:{' '}
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="regular">Regular</option>
              <option value="completed">Completed</option>
            </select>
          </label>
          <Todos todos={todos} filter={filter} deleteItem={deleteItem} />
        </div>
      </main>
    </div>
  );
}

export default App;
