export type Todo = {
  id: number;
  created_at: string;
  title: string;
  description?: string;
  is_complete: boolean;
  user_id: string;
  due_date?: string | null;
  priority?: 'low' | 'medium' | 'high' | null;
};

export type Database = {
  public: {
    Tables: {
      todos: {
        Row: Todo;
        Insert: Omit<Todo, 'id' | 'created_at'>;
        Update: Partial<Omit<Todo, 'id' | 'created_at'>>;
      };
    };
  };
};
