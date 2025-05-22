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
    low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    medium:
      'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  const icons = {
    low: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-3 w-3 mr-1'
        viewBox='0 0 20 20'
        fill='currentColor'
      >
        <path
          fillRule='evenodd'
          d='M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z'
          clipRule='evenodd'
        />
      </svg>
    ),
    medium: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-3 w-3 mr-1'
        viewBox='0 0 20 20'
        fill='currentColor'
      >
        <path
          fillRule='evenodd'
          d='M4 10a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z'
          clipRule='evenodd'
        />
      </svg>
    ),
    high: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-3 w-3 mr-1'
        viewBox='0 0 20 20'
        fill='currentColor'
      >
        <path
          fillRule='evenodd'
          d='M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z'
          clipRule='evenodd'
        />
      </svg>
    ),
  };

  return (
    <span
      className={`${
        colors[priority as keyof typeof colors]
      } text-xs px-2 py-1 rounded-full font-medium ml-2 inline-flex items-center`}
    >
      {icons[priority as keyof typeof icons]}
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
    <div className='max-w-3xl mx-auto p-6'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-2xl font-bold text-slate-800 dark:text-white'>
          My Tasks
        </h1>
      </div>

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
          className='flex items-center justify-center w-full py-4 mb-8 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg transition-colors shadow-sm hover:shadow group'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5 mr-2 group-hover:scale-110 transition-transform'
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
          className='mb-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-100 dark:border-slate-700 transition-all'
        >
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl font-bold text-slate-800 dark:text-white'>
              Create New Task
            </h2>
            <button
              type='button'
              onClick={() => setShowForm(false)}
              className='text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
            </button>
          </div>

          <div className='mb-4'>
            <label
              htmlFor='title'
              className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'
            >
              Task Title *
            </label>
            <input
              id='title'
              type='text'
              placeholder='What needs to be done?'
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className='w-full border border-slate-200 dark:border-slate-600 px-4 py-3 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors'
              required
            />
          </div>

          <div className='mb-4'>
            <label
              htmlFor='description'
              className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'
            >
              Description (optional)
            </label>
            <textarea
              id='description'
              placeholder='Add details about your task'
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className='w-full border border-slate-200 dark:border-slate-600 px-4 py-3 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors'
              rows={2}
            />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
            <div>
              <label
                htmlFor='dueDate'
                className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'
              >
                Due Date (optional)
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5 text-slate-400'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <input
                  id='dueDate'
                  type='date'
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className='w-full border border-slate-200 dark:border-slate-600 pl-10 px-4 py-3 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors'
                />
              </div>
            </div>

            <div>
              <label
                htmlFor='priority'
                className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'
              >
                Priority (optional)
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5 text-slate-400'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M3 6a3 3 0 013-3h10a1 1 0 011 1v10a2 2 0 01-2 2H4a1 1 0 01-1-1V6z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <select
                  id='priority'
                  value={newPriority}
                  onChange={(e) =>
                    setNewPriority(
                      e.target.value as '' | 'low' | 'medium' | 'high'
                    )
                  }
                  className='w-full border border-slate-200 dark:border-slate-600 pl-10 px-4 py-3 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors appearance-none'
                >
                  <option value=''>No priority</option>
                  <option value='low'>Low</option>
                  <option value='medium'>Medium</option>
                  <option value='high'>High</option>
                </select>
                <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4 text-slate-400'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className='flex justify-end space-x-3'>
            <button
              type='button'
              onClick={() => setShowForm(false)}
              className='px-5 py-3 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-5 py-3 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg shadow-sm hover:shadow transition-all flex items-center'
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
              Add Task
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className='h-60 flex flex-col items-center justify-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
          <p className='mt-4 text-slate-500 dark:text-slate-400'>
            Loading tasks...
          </p>
        </div>
      ) : (
        <div>
          {todos.length === 0 ? (
            <div className='text-center py-16 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700'>
              <div className='mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-8 w-8'
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
              </div>
              <h3 className='text-xl font-medium text-slate-800 dark:text-white mb-2'>
                All Clear!
              </h3>
              <p className='text-slate-500 dark:text-slate-400'>
                No tasks yet. Add a new one to get started!
              </p>
            </div>
          ) : (
            <ul className='space-y-4'>
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className={`p-5 ${
                    todo.is_complete
                      ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                      : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'
                  } rounded-xl shadow-sm hover:shadow border task-card`}
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex items-start space-x-3'>
                      <button
                        onClick={() =>
                          toggleTodoStatus(todo.id, todo.is_complete)
                        }
                        className={`mt-1.5 flex-shrink-0 h-5 w-5 rounded-full border-2 ${
                          todo.is_complete
                            ? 'bg-blue-500 border-blue-500 dark:bg-blue-600 dark:border-blue-600'
                            : 'border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400'
                        } flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
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
