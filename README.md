# Todo List Application

A full-stack todo list application built with React, Node.js, Express, and MySQL.

## Features

- Create, read, update, and delete todo items
- Mark todos as complete/incomplete
- Add optional descriptions to todos
- Clean and responsive UI with Tailwind CSS
- Persistent storage in MySQL database

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm or yarn package manager

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd todo-app
```

2. Set up the database:
- Create a MySQL database named `todo_db`
- Run the SQL commands in `server/schema.sql` to create the necessary table

3. Configure environment variables:
Create a `.env` file in the root directory with the following content:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=todo_db
PORT=5000
```

4. Install dependencies:

For the backend:
```bash
cd server
npm install
```

For the frontend:
```bash
cd client
npm install
```

## Running the Application

1. Start the backend server:
```bash
cd server
npm start
```

2. Start the frontend development server:
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

- `GET /todos` - Get all todos
- `POST /todos` - Create a new todo
- `PUT /todos/:id` - Update a todo
- `DELETE /todos/:id` - Delete a todo

## Technologies Used

- Frontend:
  - React
  - Vite
  - Tailwind CSS
  - Fetch API

- Backend:
  - Node.js
  - Express.js
  - MySQL
  - CORS
  - dotenv 