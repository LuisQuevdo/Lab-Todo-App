# TODO App - Sistema de Gestión de Tareas

## Descripción
Este proyecto consiste en una **aplicación web de gestión de tareas (TODO App)** desarrollada con una arquitectura moderna basada en **contenedores Docker**.  
Permite crear, listar, completar y eliminar tareas, utilizando un backend en **Node.js + Express + PostgreSQL** y un frontend en **HTML, CSS y JavaScript** servido por **Nginx**.

---

## Arquitectura

La aplicación está compuesta por tres servicios orquestados mediante **Docker Compose**:
```bash
┌──────────────────────────────────────────┐
│ FRONTEND (Nginx)                         │
│ Puerto: 8080                             │
│ • HTML, CSS y JS                         │
│ • Consume API REST del backend           │
└───────────────▲──────────────────────────┘
           Fetch (HTTP)
┌───────────────┴──────────────────────────┐
│ BACKEND (Node.js)                        │
│ Puerto: 3000                             │
│ • API REST con Express                   │
│ • CRUD de tareas                         │
│ • Conexión a PostgreSQL                  │
└───────────────▲──────────────────────────┘
             Pool (pg)
┌───────────────┴──────────────────────────┐
│ DATABASE (PostgreSQL)                    │
│ Puerto interno: 5432                     │
│ • Base de datos: todo_db                 │
│ • Tabla: tasks                           │
└──────────────────────────────────────────┘
```
---

## Tecnologías

- **Backend:** Node.js + Express + PostgreSQL  
- **Frontend:** HTML + CSS + JavaScript + Nginx  
- **Base de Datos:** PostgreSQL 15  
- **Orquestación:** Docker + Docker Compose  

---

## Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- **Docker** versión 20 o superior  
- **Docker Compose** versión 2 o superior  
- **Git**

---

## Instalación y Ejecución

### 1. Clonar el repositorio
```bash
git clone https://github.com/LuisQuevdo/Lab-Todo-App.git
cd todo-app
```
2. Levantar los servicios con Docker Compose
```bash
Copiar código
docker compose up -d
```
Este comando levantará tres contenedores:

```ginx
todo_db → PostgreSQL  
todo_backend → API Node.js  
todo_frontend → Servidor Nginx
```
3. Acceder a la aplicación
4. 
Frontend: http://localhost:8080  
Backend (API): http://localhost:3000/tasks

Comandos Útiles
```bash
Comando	            Descripción
docker compose up -d	Levanta los servicios en segundo plano
docker compose down	Detiene y elimina los contenedores
docker compose logs -f	Muestra los logs del backend en tiempo real
docker compose ps	Lista los servicios activos
```

Estructura del Proyecto
```bash
todo-app/
├── backend/
│   ├── src/
│   │   └── index.js
│   ├── package.json
│   ├── Dockerfile
│
├── frontend/
│   ├── index.html
│   ├── styles.css
│   ├── nginx.conf
│   └── Dockerfile
│
├── docs/
│   └── arquitectura.md
│
├── docker-compose.yml
└── README.md
```
API Endpoints
```bash
Método	Endpoint	Descripción
GET	/tasks	Obtiene todas las tareas
POST	/tasks	Crea una nueva tarea
PUT	/tasks/:id	Actualiza el estado (completado) de una tarea
DELETE	/tasks/:id	Elimina una tarea existente
```
Ejemplo de Objeto JSON

```json
{
  "id": 1,
  "title": "Hacer Tarea de Implantación de Sistemas",
  "completed": false,
  "created_at": "2025-10-15T22:00:00Z"
}
```
Autores
Estudiante 1: Luis Fernando Quevedo Vanegas

Estudiante 2: Miguel Angel Molina Cruz

Fecha de Entrega
15 de octubre de 2025

Notas
La app está completamente dockerizada.

Cada servicio se ejecuta de forma independiente pero conectada en la red interna de Docker.

El contenedor de PostgreSQL mantiene sus datos en el volumen db_data.

La interfaz es simple, intuitiva y completamente funcional.
