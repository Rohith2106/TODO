const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'your sql pass',
  database: process.env.DB_NAME || 'todo_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Successfully connected to database');
  connection.release();
});

app.get('/todos', async (req, res) => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM todos ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

app.post('/todos', async (req, res) => {
  const { title, description, reminder } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const [result] = await promisePool.query(
      'INSERT INTO todos (title, description, reminder) VALUES (?, ?, ?)',
      [title, description, reminder]
    );
    
    const [newTodo] = await promisePool.query(
      'SELECT * FROM todos WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newTodo[0]);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, completed, reminder } = req.body;

  try {
    const [result] = await promisePool.query(
      'UPDATE todos SET title = ?, description = ?, completed = ?, reminder = ? WHERE id = ?',
      [title, description, completed, reminder, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const [updatedTodo] = await promisePool.query(
      'SELECT * FROM todos WHERE id = ?',
      [id]
    );

    res.json(updatedTodo[0]);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await promisePool.query(
      'DELETE FROM todos WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

app.put('/todos/:id/reminder', async (req, res) => {
  const { id } = req.params;
  const { reminder } = req.body;

  console.log('Setting reminder for todo:', id, 'Reminder:', reminder);

  try {
    if (!reminder || isNaN(new Date(reminder).getTime())) {
      console.error('Invalid reminder date:', reminder);
      return res.status(400).json({ error: 'Invalid reminder date' });
    }

    const formattedDate = new Date(reminder).toISOString().slice(0, 19).replace('T', ' ');

    const [result] = await promisePool.query(
      'UPDATE todos SET reminder = ? WHERE id = ?',
      [formattedDate, id]
    );

    if (result.affectedRows === 0) {
      console.error('Todo not found:', id);
      return res.status(404).json({ error: 'Todo not found' });
    }

    const [updatedTodo] = await promisePool.query(
      'SELECT * FROM todos WHERE id = ?',
      [id]
    );

    console.log('Successfully set reminder:', updatedTodo[0]);
    res.json(updatedTodo[0]);
  } catch (error) {
    console.error('Error setting reminder:', error);
    res.status(500).json({ 
      error: 'Failed to set reminder',
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
