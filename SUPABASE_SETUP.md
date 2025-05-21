# Supabase Setup Instructions

Follow these steps to set up your Supabase project for the Todo app:

1. **Create a Supabase account**:

   - Go to [Supabase](https://supabase.com/) and sign up for a free account.

2. **Create a new project**:

   - Click "New Project" in the dashboard.
   - Enter a name for your project.
   - Set a secure database password.
   - Choose the closest region to you.
   - Click "Create new project".

3. **Create the "todos" table**:

   - In your project dashboard, go to the "Table Editor" section.
   - Click "New Table".
   - Set the table name to "todos".
   - Add the following columns:
     - `id` (type: int8, Primary Key, Is Identity = true)
     - `created_at` (type: timestamptz, Default Value = now())
     - `title` (type: text, not nullable)
     - `description` (type: text, nullable)
     - `is_complete` (type: boolean, Default Value = false)
     - `user_id` (type: text, not nullable) - Note: This can accept any string for now (like 'anonymous')
     - `due_date` (type: date, nullable)
     - `priority` (type: text, nullable) - Note: This should accept values like 'low', 'medium', 'high'
   - Click "Save".

4. **Configure Row Level Security (RLS)**:

   - In the table view, go to "Authentication" tab in the left sidebar.
   - Click on "Policies" tab.
   - Find the "todos" table in the list and make sure RLS is enabled.
   - Then click "New Policy" to create the following policies:

   **For Select (read) operations**:
   
   - Select "Create a policy from scratch"
   - Policy name: "Enable read access for all users"
   - For operation: SELECT
   - Policy definition (using the editor): `true` 
   - Click "Review" then "Save Policy"

   **For Insert operations**:
   
   - Click "New Policy" again
   - Select "Create a policy from scratch"
   - Policy name: "Enable insert for all users"
   - For operation: INSERT
   - Policy definition (using the editor): `true`
   - Click "Review" then "Save Policy"

   **For Update operations**:
   
   - Click "New Policy" again
   - Select "Create a policy from scratch"
   - Policy name: "Enable update for all users"
   - For operation: UPDATE
   - Policy definition (using the editor): `true` 
   - Click "Review" then "Save Policy"

   **For Delete operations**:
   
   - Click "New Policy" again
   - Select "Create a policy from scratch"
   - Policy name: "Enable delete for all users"
   - For operation: DELETE
   - Policy definition (using the editor): `true`
   - Click "Review" then "Save Policy"
   
   **Note:** For a production app, you would use `auth.uid() = user_id` instead of `true` for these policies.

5. **Get API Keys**:

   - Go to "Settings" > "API".
   - Copy your "Project URL" and paste it in the `.env.local` file as `NEXT_PUBLIC_SUPABASE_URL`.
   - Copy your "anon public" key and paste it in the `.env.local` file as `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

6. **Run the application**:
   - Start your Next.js application with `npm run dev`.
   - Navigate to http://localhost:3000 to see the Todo app.

Note: For a production application, you would want to implement proper authentication and more secure RLS policies. This setup is simplified for demonstration purposes.
