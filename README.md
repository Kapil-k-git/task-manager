Task Manager App
A simple Task Manager application built using Next.js and Supabase, allowing users to authenticate and manage tasks with secure row-level access.

Live Demo
Vercel Deployment
https://task-manager-alpha-six-52.vercel.app

GitHub Repository
https://github.com/Kapil-k-git/task-manager

Tech Stack
Frontend: Next.js (App Router)
Backend / Database: Supabase
Authentication: Supabase Auth (Email & Password)
Database Security: Supabase Row Level Security (RLS)

Deployment: Vercel
Features
User signup & login using Supabase Authentication
Create, view, and manage tasks

Secure task access using Row Level Security (users can only access their own tasks)
Fully deployed and accessible via Vercel
Task Payload Example
{
"title": "New Task",
"description": "Task description",
"status": "todo"
}

Setup Instructions (Local Development)
1 Clone the repository
git clone https://github.com/Kapil-k-git/task-manager.git
cd task-manager

2 Install dependencies
npm install

3 Setup Environment Variables
Create a .env.local file in the root directory and add:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

These values can be found in your Supabase Dashboard → Project Settings → API

4 Run the development server
npm run dev

App will be available at:

http://localhost:3000

Supabase Configuration Notes
Authentication is handled using Supabase Auth
The tasks table uses Row Level Security (RLS) to ensure:
Users can only read/write their own tasks
Policies are applied based on auth.uid()

Usage
Sign up or log in using email & password
Create tasks
View and manage your own tasks securely

## Supabase Database & RLS Setup

All Supabase-related SQL queries for:
- Creating the `tasks` table
- Enabling Row Level Security (RLS)
- Defining user-based access policies

are documented in a separate file for convenience:

**`SUPABASE_SETUP.md`**

This file also explains **where and how to execute these queries** inside the Supabase Dashboard (SQL Editor).

Deployment
The application is deployed using Vercel and connected to Supabase, so:
Authentication
Database operations
RLS policies

work seamlessly in production.
Author
Kapil
GitHub: https://github.com/Kapil-k-git

✅ Submission Checklist
✅ GitHub repository provided
✅ README with setup & usage
✅ Live deployed link included
