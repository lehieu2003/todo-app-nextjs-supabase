'use client';

import { useState, useEffect } from 'react';
import { createClientSupabaseClient } from '@/lib/supabase';
import { Todo } from '@/types/supabase';
import { useRouter } from 'next/navigation';

// Priority badge component
const PriorityBadge = ({
  priority,
}: {
  priority: string | null | undefined;
}) => {
  if (!priority) return null;

  const colors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  return (
    <span
      className={`${
        colors[priority as keyof typeof colors]
      } text-xs px-2 py-1 rounded-full font-medium ml-2`}
    >
      {priority}
    </span>
  );
};

// Due date formatter
const formatDueDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isToday = date.toDateString() === today.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();
  const isPast = date < today;

  const formattedDate = date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  if (isToday) return `Today, ${formattedDate}`;
  if (isTomorrow) return `Tomorrow, ${formattedDate}`;
  if (isPast) return `Overdue, ${formattedDate}`;
  return formattedDate;
};

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState<
    'low' | 'medium' | 'high' | ''
  >('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null); // We'll use any for now as the Supabase user type
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  // Load todos on component mount and get current user
  useEffect(() => {
    fetchTodos();
    getCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getCurrentUser() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error('Error getting user:', error);
    }
  }

  async function fetchTodos() {
    try {
      setLoading(true);
      console.log('Fetching todos from Supabase...');
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch error:', error);
        throw error;
      }
      if (data) {
        console.log('Todos fetched successfully:', data.length);
        setTodos(data);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
      alert(
        'Error loading todos. Please check your Supabase setup and RLS policies.'
      );
    } finally {
      setLoading(false);
    }
  }

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (newTodo.trim() === '') return;

    try {
      console.log('Adding new todo to Supabase...');

      // Ensure user is logged in before adding a todo
      if (!user?.id) {
        alert('You need to login first to add a todo');
        router.push('/login');
        return;
      }

      console.log('Todo data:', {
        title: newTodo.trim(),
        description: newDescription.trim() || null,
        is_complete: false,
        user_id: user.id,
        due_date: newDueDate || null,
        priority: newPriority || null,
      });

      const { data, error } = await supabase
        .from('todos')
        .insert([
          {
            title: newTodo.trim(),
            description: newDescription.trim() || null,
            is_complete: false,
            user_id: user.id, // Use the authenticated user ID
            due_date: newDueDate || null,
            priority: newPriority || null,
          },
        ])
        .select();

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }

      if (data) {
        console.log('Todo added successfully:', data[0]);
        setTodos([data[0], ...todos]);
        setNewTodo('');
        setNewDescription('');
        setNewDueDate('');
        setNewPriority('');
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error adding todo:', error);
      alert(
        'Error adding todo. Please check your Supabase setup and make sure RLS policies are properly configured.'
      );
    }
  }

  async function toggleTodoStatus(id: number, is_complete: boolean) {
    // Check if user is logged in
    if (!user) {
      alert('You must be logged in to update a todo');
      router.push('/login');
      return;
    }

    try {
      const { error } = await supabase
        .from('todos')
        .update({ is_complete: !is_complete })
        .eq('id', id);

      if (error) throw error;
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, is_complete: !is_complete } : todo
        )
      );
    } catch (error) {
      console.error('Error toggling todo status:', error);
    }
  }

  async function deleteTodo(id: number) {
    // Check if user is logged in
    if (!user) {
      alert('You must be logged in to delete a todo');
      router.push('/login');
      return;
    }

    try {
      const { error } = await supabase.from('todos').delete().eq('id', id);

      if (error) throw error;
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  }

  return (
    <div className='max-w-2xl mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Todo App</h1>

      {!showForm ? (
        <button
          onClick={() => {
            if (!user) {
              alert('You need to login first to add a todo');
              router.push('/login');
              return;
            }
            setShowForm(true);
          }}
          className='flex items-center justify-center w-full py-3 mb-6 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition-colors'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5 mr-2'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
              clipRule='evenodd'
            />
          </svg>
          Add New Task
        </button>
      ) : (
        <form
          onSubmit={addTodo}
          className='mb-6 bg-white rounded-lg shadow p-4 border border-gray-200'
        >
          <div className='mb-4'>
            <label
              htmlFor='title'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Task Title *
            </label>
            <input
              id='title'
              type='text'
              placeholder='What needs to be done?'
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className='w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>

          <div className='mb-4'>
            <label
              htmlFor='description'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Description (optional)
            </label>
            <textarea
              id='description'
              placeholder='Add details about your task'
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className='w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              rows={2}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
            <div>
              <label
                htmlFor='dueDate'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Due Date (optional)
              </label>
              <input
                id='dueDate'
                type='date'
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className='w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>

            <div>
              <label
                htmlFor='priority'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Priority (optional)
              </label>
              <select
                id='priority'
                value={newPriority}
                onChange={(e) =>
                  setNewPriority(
                    e.target.value as '' | 'low' | 'medium' | 'high'
                  )
                }
                className='w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value=''>No priority</option>
                <option value='low'>Low</option>
                <option value='medium'>Medium</option>
                <option value='high'>High</option>
              </select>
            </div>
          </div>

          <div className='flex justify-end space-x-2'>
            <button
              type='button'
              onClick={() => setShowForm(false)}
              className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none'
            >
              Add Task
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className='h-60 flex items-center justify-center'>
          <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500'></div>
        </div>
      ) : (
        <div>
          {todos.length === 0 ? (
            <div className='text-center py-10'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-16 w-16 mx-auto text-gray-300'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <p className='text-gray-500 mt-4'>
                No tasks yet. Add a new one to get started!
              </p>
            </div>
          ) : (
            <ul className='space-y-3'>
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className={`p-4 ${
                    todo.is_complete ? 'bg-gray-50' : 'bg-white'
                  } rounded-lg shadow border border-gray-200 hover:border-gray-300 transition-colors`}
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex items-start space-x-2'>
                      <button
                        onClick={() =>
                          toggleTodoStatus(todo.id, todo.is_complete)
                        }
                        className={`mt-1 flex-shrink-0 h-5 w-5 rounded-full border ${
                          todo.is_complete
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-gray-300'
                        } flex items-center justify-center focus:outline-none`}
                      >
                        {todo.is_complete && (
                          <svg
                            className='h-3 w-3 text-white'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                          >
                            <path
                              fillRule='evenodd'
                              d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                              clipRule='evenodd'
                            />
                          </svg>
                        )}
                      </button>
                      <div>
                        <h3
                          className={`text-lg font-medium ${
                            todo.is_complete
                              ? 'text-gray-500 line-through'
                              : 'text-gray-900'
                          }`}
                        >
                          {todo.title}
                          <PriorityBadge priority={todo.priority} />
                        </h3>
                        {todo.description && (
                          <p
                            className={`mt-1 text-sm ${
                              todo.is_complete
                                ? 'text-gray-400'
                                : 'text-gray-600'
                            }`}
                          >
                            {todo.description}
                          </p>
                        )}
                        {todo.due_date && (
                          <p
                            className={`mt-1 text-xs ${
                              todo.is_complete
                                ? 'text-gray-400'
                                : 'text-gray-500'
                            }`}
                          >
                            {formatDueDate(todo.due_date)}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className='text-gray-400 hover:text-red-500 focus:outline-none'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                        />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
