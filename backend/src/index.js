const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();

// --- Configuración de la Base de Datos desde Variables de Entorno ---
const pool = new Pool({
  user: process.env.DB_USER || 'user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'todo_db',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// --- Middleware ---
app.use(cors()); // Permite peticiones desde el frontend (puerto 8080)
app.use(express.json()); // Habilita la lectura de JSON en el cuerpo de las peticiones

// --- Función de Inicialización (Crear tabla si no existe) ---
async function initDB() {
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    client.release();
    console.log("Tabla 'tasks' verificada o creada exitosamente.");
  } catch (err) {
    console.error("Error al inicializar la base de datos:", err.message);
    // En producción, podrías implementar una lógica de reintento.
  }
}

// --- Endpoints CRUD ---

// 1. Obtener todas las tareas (GET /api/tasks)
app.get('/api/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
});

// 2. Crear una nueva tarea (POST /api/tasks)
app.post('/api/tasks', async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'El título es requerido' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
      [title]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear tarea' });
  }
});

// 3. Actualizar una tarea (PUT /api/tasks/:id)
app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  
  // Construir la consulta de manera segura
  let queryParts = [];
  let queryValues = [];
  let paramCount = 1;

  if (title !== undefined) {
    queryParts.push(`title = $${paramCount++}`);
    queryValues.push(title);
  }
  if (completed !== undefined) {
    queryParts.push(`completed = $${paramCount++}`);
    queryValues.push(completed);
  }

  if (queryParts.length === 0) {
    return res.status(400).json({ error: 'Datos a actualizar no proporcionados' });
  }

  const queryText = `UPDATE tasks SET ${queryParts.join(', ')} WHERE id = $${paramCount} RETURNING *`;
  queryValues.push(id);

  try {
    const result = await pool.query(queryText, queryValues);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar tarea' });
  }
});

// 4. Eliminar una tarea (DELETE /api/tasks/:id)
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    res.status(204).send(); // 204 No Content
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar tarea' });
  }
});

// --- Iniciar Servidor ---
const PORT = process.env.PORT || 3000;

// Primero inicializa la DB, luego levanta el servidor
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(` Servidor backend escuchando en http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error(' Fallo crítico al iniciar la aplicación:', err.message);
});
