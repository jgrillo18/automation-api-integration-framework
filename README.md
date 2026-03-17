# Automation API Integration Framework

![Stack](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)
![Stack](https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat-square&logo=postgresql)
![Stack](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens)
![Stack](https://img.shields.io/badge/Frontend-React_+_Vite-61DAFB?style=flat-square&logo=react)
![Stack](https://img.shields.io/badge/Deploy-Render-46E3B7?style=flat-square&logo=render)
![Stack](https://img.shields.io/badge/Container-Docker-2496ED?style=flat-square&logo=docker)

Plataforma SaaS multi-tenant para automatizar e integrar procesos empresariales. Permite definir workflows que conectan sistemas aislados (ERP, CRM, etc.) y ejecutarlos automáticamente con un motor propio.

---

## 🧩 Funcionalidades

| Categoria | Detalle |
|---|---|
| **Multi-tenant** | Cada organizacion ve unicamente sus propios datos |
| **Usuarios y roles** | Miembros y administradores por tenant |
| **Workflows** | Crear, editar, ejecutar manualmente y listar |
| **Integraciones** | Webhook URL, email y Slack channel por workflow |
| **Scheduler** | Ejecuta todos los workflows cada 5 minutos automaticamente |
| **Historial** | Almacena resultado y payload JSON por ejecucion |
| **Panel admin** | Crear usuarios y organizaciones desde la UI |
| **Metricas** | `/metrics` Prometheus expuesto por el backend |
| **OpenAPI** | Swagger UI en `/docs`, ReDoc en `/redoc` |

---

## 📂 Estructura

```
automation-api-integration-framework/
├── backend/                     # API FastAPI + SQLAlchemy + Alembic
│   ├── app/
│   │   ├── main.py              # App factory, CORS, routers, seeding
│   │   ├── api/
│   │   │   ├── auth.py          # /auth/register, /auth/login, /auth/me
│   │   │   ├── workflows.py     # CRUD workflows + run + executions
│   │   │   ├── dashboard.py     # /dashboard conteos
│   │   │   ├── admin_routes.py  # /admin/users, /admin/organizations
│   │   │   └── deps.py          # get_db, get_current_user, get_current_admin
│   │   ├── core/
│   │   │   ├── config.py        # Settings (pydantic-settings, fix postgres://)
│   │   │   ├── database.py      # Engine con retry, SessionLocal, Base
│   │   │   └── security.py      # hash_password, verify_password, JWT
│   │   ├── models/              # User, Organization, Workflow, Execution
│   │   ├── schemas/             # Pydantic v2 schemas con from_attributes
│   │   └── services/
│   │       ├── workflow_engine.py  # Ejecuta workflow (webhook, email, slack)
│   │       └── scheduler.py        # APScheduler cada 5 min
│   ├── alembic/                 # Migraciones
│   ├── alembic.ini
│   ├── entrypoint.sh            # create_all + alembic upgrade + uvicorn $PORT
│   ├── Dockerfile               # multi-stage python:3.11-slim
│   └── requirements.txt
├── frontend/                    # SPA React (Vite) servida por nginx
│   ├── src/
│   │   ├── pages/               # Login, Register, Dashboard, Workflows, Admin, History
│   │   ├── components/          # NavBar
│   │   └── services/api.js      # axios con JWT interceptor, usa VITE_API_URL
│   ├── nginx.conf               # SPA fallback a index.html
│   ├── Dockerfile               # multi-stage node:20 + nginx:stable-alpine
│   └── package.json
├── docker-compose.yml           # db + backend + frontend (local)
├── render.yaml                  # Despliegue en Render (backend + frontend)
├── Procfile                     # Heroku / alternativa
└── .env.example
```

---

## 🚀 Arranque rapido con Docker

```bash
# clonar
git clone https://github.com/jgrillo18/automation-api-integration-framework.git
cd automation-api-integration-framework

# configurar variables
cp .env.example .env
# editar .env si necesario

# levantar todo
docker compose up --build
```

| Servicio | URL |
|---|---|
| Frontend | http://localhost:8080 |
| Backend API | http://localhost:8000 |
| Swagger UI | http://localhost:8000/docs |
| Metricas | http://localhost:8000/metrics |

---

## ☁️ Despliegue en Render

El `render.yaml` incluido crea dos servicios automaticamente:

### Pasos

1. **Conecta el repositorio** en [render.com](https://render.com) → New → Blueprint
2. Render detectara el `render.yaml` y creara los servicios `automation-api-backend` y `automation-api-frontend`
3. **Configura las variables de entorno del backend** (marcadas como `sync: false`):

| Variable | Valor |
|---|---|
| `DATABASE_URL` | URL PostgreSQL de Neon.tech u otro proveedor |
| `SECRET_KEY` | Clave aleatoria larga (min 32 chars) |

4. Render desplegara automaticamente en cada push a `main`
5. Las migraciones se ejecutan automaticamente con `alembic upgrade head` al iniciar

> El frontend recibe `VITE_API_URL` automaticamente via `fromService.hostURL` apuntando al backend.

### Servicios creados

| Nombre | Tipo | Descripcion |
|---|---|---|
| `automation-api-backend` | Web (Python) | FastAPI + uvicorn |
| `automation-api-frontend` | Static Site | React/Vite servida por Render CDN |

---

## 🔌 Endpoints REST

### Autenticacion

| Metodo | Ruta | Descripcion | Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Registrar usuario (email, password, organization) | No |
| `POST` | `/auth/login` | Obtener token JWT | No |
| `GET` | `/auth/me` | Usuario actual | JWT |

### Workflows

| Metodo | Ruta | Descripcion | Auth |
|---|---|---|---|
| `POST` | `/workflows/` | Crear workflow | JWT |
| `GET` | `/workflows/` | Listar workflows de la org | JWT |
| `PATCH` | `/workflows/{id}` | Editar workflow | JWT |
| `POST` | `/workflows/{id}/run` | Ejecutar manualmente | JWT |
| `GET` | `/workflows/{id}/executions` | Historial de ejecuciones | JWT |

### Dashboard y Admin

| Metodo | Ruta | Descripcion | Auth |
|---|---|---|---|
| `GET` | `/dashboard/` | Conteos de workflows y ejecuciones | JWT |
| `GET` | `/admin/users` | Listar usuarios de la org | JWT + admin |
| `POST` | `/admin/users` | Crear usuario | JWT + admin |
| `GET` | `/admin/organizations` | Listar organizaciones | JWT + admin |
| `GET` | `/health` | Health check | No |
| `GET` | `/metrics` | Metricas Prometheus | No |

---

## ⚙️ Variables de entorno

| Variable | Default | Descripcion |
|---|---|---|
| `ENV` | `development` | `development` / `production` — en dev crea tablas al inicio |
| `DATABASE_URL` | `postgresql://postgres:postgres@db:5432/automation` | URL PostgreSQL |
| `SECRET_KEY` | `supersecretkey` | Clave para JWT — cambiar en produccion |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `60` | Duracion del token |

> `DATABASE_URL` con formato `postgres://` se convierte automaticamente a `postgresql://` (compatibilidad Neon / Render).

---

## 🛠️ Migraciones (Alembic)

Las migraciones se ejecutan automaticamente con `alembic upgrade head` en el entrypoint.

Para crear una nueva migracion en desarrollo:

```bash
cd backend
alembic revision --autogenerate -m "descripcion"
alembic upgrade head
```

---

## 🛡️ Seguridad

- Contrasenas hasheadas con **PBKDF2-SHA256** via passlib
- Autenticacion stateless con **JWT** (python-jose)
- Control de acceso por rol (`is_admin`) en endpoints admin
- Multi-tenant: cada query filtra por `organization_id`
- Validacion de entrada con Pydantic v2 (email, min/max length, regex)
- Variables sensibles en variables de entorno

---

## 🧪 Desarrollo local (sin Docker)

```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
# configurar DATABASE_URL en .env apuntando a PostgreSQL local
alembic upgrade head
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
# crear .env.local con: VITE_API_URL=http://localhost:8000
npm run dev
```

---

## 👨‍💻 Autor

**Jhonnathan Grillo**
Ingeniero de Sistemas · Automatizacion Empresarial · Arquitectura SaaS
✉️ jhonnathan@jgrillo.tech
