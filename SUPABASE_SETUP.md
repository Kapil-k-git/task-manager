Supabase Database Setup – Task Manager
This document explains the database schema, Row Level Security (RLS) policies, and SQL queries used for the Task Manager application.

Table: tasks
Purpose

Stores user-specific tasks. Each task belongs to a single authenticated user.

Where to Run These SQL Queries in Supabase
All the SQL queries mentioned in this document should be executed inside the Supabase Dashboard.

Step-by-Step Instructions

1) Go to Supabase Dashboard
2) Select your Project
3) From the left sidebar, click SQL Editor 
   Click “New query”
4) Paste the SQL queries from this document
5) Click Run

Important Order:
1. Create table
2. Enable RLS
3. Create policies

What Goes Where?
1. Create Table Query

  SQL Editor → New Query

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  description text,
  status text check (status in ('todo', 'in_progress', 'done')) default 'todo',
  created_at timestamp with time zone default now()
);

2. Enable Row Level Security (RLS)

    SQL Editor → Same or New Query

alter table public.tasks enable row level security;

3. Create RLS Policies

📍 SQL Editor → New Query

You can run all policies together or one by one:

create policy "Users can read their own tasks"
on public.tasks
for select
using (auth.uid() = user_id);

create policy "Users can create their own tasks"
on public.tasks
for insert
with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
on public.tasks
for update
using (auth.uid() = user_id);

create policy "Users can delete their own tasks"
on public.tasks
for delete
using (auth.uid() = user_id);

🔍 How to Verify Everything Is Working
Check Table

Go to Table Editor
You should see tasks table
Check RLS

Open tasks table
RLS toggle should be ON
Check Policies

Go to Authentication → Policies
Confirm policies exist for tasks

Test From Frontend
Once deployed (local or Vercel):
Sign up / log in
Create a task
Only logged-in user should see their tasks
Other users cannot access your data
This confirms RLS is working correctly.