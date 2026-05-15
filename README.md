# ⚽ Sistema de Gestión de Mundial

Aplicación Fullstack desarrollada como prueba técnica, enfocada en la gestión de equipos, grupos y sorteos de un Mundial de fútbol.

El sistema permite:

- Registrar equipos participantes
- Gestionar grupos
- Generar sorteos aleatorios
- Visualizar vista previa de sorteos
- Guardar distribuciones históricas
- Validar reglas matemáticas de distribución

---

# 🚀 Tecnologías Utilizadas

## Backend

- Node.js
- Express
- PostgreSQL
- pgAdmin
- dotenv
- nodemon

## Frontend

- HTML5
- CSS3
- JavaScript Vanilla
- Fetch API

---

# 📁 Arquitectura del Proyecto

## Backend

```bash
src/
├── controllers/
│   ├── equipos.controller.js
│   ├── grupos.controller.js
│   └── sorteos.controller.js
│
├── routes/
│   ├── equipos.routes.js
│   ├── grupos.routes.js
│   └── sorteos.routes.js
│
├── middlewares/
│   ├── error.middleware.js
│   └── notFound.middleware.js
│
├── utils/
│   └── validarEquipo.js
│
├── db/
│   └── connection.js
│
└── app.js



Frontend
frontend/
├── index.html
├── grupos.html
├── sorteos.html
├── equipos.js
├── grupos.js
├── sorteos.js
└── styles.css

Instalación del mismo
git clone <URL_DEL_REPOSITORIO>

Instalar dependencias
npm install


Configuración de variables de entorno

PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=123abc
DB_NAME=mundial_db

Ejecutar Backend
npm run dev

Abrir Frontend
frontend/index.html
🗄️ Base de Datos
Tablas principales
equipos
grupos
distribuciones
distribucion_equipos

📌 Funcionalidades Implementadas
✅ Gestión de Equipos
Crear equipos
Listar equipos
Editar equipos
Eliminar equipos
Validaciones
País único
Código FIFA único
Código FIFA de 3 letras
Ranking numérico
Jugadores entre 23 y 26

✅ Gestión de Grupos
Crear grupos
Listar grupos
Editar grupos
Eliminar grupos

✅ Sorteos
Generación aleatoria de grupos
Vista previa antes de guardar
Persistencia histórica
Historial de sorteos
Validaciones
Cantidad de grupos mayor a 1
Divisibilidad exacta de equipos
Existencia suficiente de grupos
Todos los equipos deben distribuirse

🔗 Endpoints API
Equipos
Método	Endpoint	Descripción
GET	/equipos	Obtener equipos
GET	/equipos/:id	Obtener equipo
POST	/equipos	Crear equipo
PUT	/equipos/:id	Actualizar equipo
DELETE	/equipos/:id	Eliminar equipo

Grupos
Método	Endpoint	Descripción
GET	/grupos	Obtener grupos
GET	/grupos/:id	Obtener grupo
POST	/grupos	Crear grupo
PUT	/grupos/:id	Actualizar grupo
DELETE	/grupos/:id	Eliminar grupo

Sorteos
Método	Endpoint	Descripción
POST	/sorteos/preview	Vista previa sorteo
POST	/sorteos/generar	Guardar sorteo
GET	/sorteos	Historial sorteos
GET	/sorteos/:id	Obtener sorteo

🧠 Lógica Implementada
Distribución aleatoria de equipos
Relaciones SQL entre tablas
Persistencia histórica
Validaciones matemáticas
Arquitectura modular MVC
Manejo global de errores

🎨 Características Frontend
Diseño responsive básico
Dashboard moderno
Cards dinámicas
Tablas responsive
Vista previa interactiva
Navegación entre módulos

👨‍💻 Autor

Desarrollado por Marco de León.
