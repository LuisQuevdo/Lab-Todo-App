const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

// 2.4 Configuración de Conexión a BD (Variables de Entorno)
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432, // Puerto por defecto
});

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors()); // Permite peticiones desde el frontend
app.use(express.json()); // Permite parsear el body de las peticiones

// 2.3 Modelo de Datos - Función para crear la tabla si no existe
const createTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS tasks (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            completed BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await pool.query(query);
        console.log("Tabla 'tasks' verificada o creada exitosamente.");
    } catch (err) {
        console.error("Error al crear la tabla 'tasks':", err);
        // Si la BD no está lista, la aplicación fallará aquí, lo cual es deseable en un contenedor.
    }
};

// ---------------------- ENDPOINTS (2.2) ----------------------

// GET /tasks: Obtiene todas las tareas
app.get('/tasks', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tasks ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error del servidor al obtener tareas');
    }
});

// POST /tasks: Crea una nueva tarea
app.post('/tasks', async (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'El título es requerido' });
    }
    try {
        const query = 'INSERT INTO tasks (title) VALUES ($1) RETURNING *';
        const result = await pool.query(query, [title]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error del servidor al crear tarea');
    }
});

// PUT /tasks/:id: Actualiza el estado de una tarea
app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body; 

    // Solo se espera el campo 'completed' para este laboratorio
    if (typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'El campo "completed" es requerido y debe ser booleano' });
    }

    try {
        const query = 'UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *';
        const result = await pool.query(query, [completed, id]);
        
        if (result.rowCount === 0) {
            return res.status(404).send('Tarea no encontrada');
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error del servidor al actualizar tarea');
    }
});

// DELETE /tasks/:id: Elimina una tarea
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
        
        if (result.rowCount === 0) {
            return res.status(404).send('Tarea no encontrada');
        }
        res.status(204).send(); // 204 No Content
    } catch (err) {
        console.error(err);
        res.status(500).send('Error del servidor al eliminar tarea');
    }
});

// Inicia el servidor
(async () => {
    await createTable();
    app.listen(PORT, () => {
        console.log(`Backend API escuchando en el puerto ${PORT}`);
    });
})();
