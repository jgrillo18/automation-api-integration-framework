# Framework de Integración y Automatización (SaaS)

Proyecto demostrativo que implementa una plataforma multi‑tenant para conectar
sistemas empresariales aislados, definir "workflows" automáticos y ejecutar
procesos con un motor propio. La idea es que una empresa pueda decir “cuando se
cree una orden en el ERP, envíala al CRM” y que eso ocurra sin intervención
humana.

Contiene backend en FastAPI, frontend en React, base de datos PostgreSQL y
se ejecuta todo mediante Docker Compose.

---

## 📂 Estructura del repositorio

```
automation-api-integration-framework/
├── backend/    # API FastAPI + SQLAlchemy + Alembic
├── frontend/   # SPA React (Vite) servida por nginx
└── docker-compose.yml
```

---

## 🚀 Requisitos de desarrollo

- Docker 24+ y Docker Compose
- Python 3.11 (solo si desarrollas el backend fuera de contenedor)
- Node 18+ (solo si desarrollas el frontend fuera de contenedor)

> El uso normal no requiere instalar nada: basta `docker compose up --build`.

---

## 🧩 Funcionalidades principales

1. **Multi‑tenant con aislamiento**: cada organización ve solo sus datos.
2. **Usuarios y roles**: miembros y administradores dentro de cada tenant.
3. **Gestión de workflows**: creación, edición, ejecución manual.
4. **Historial de ejecuciones**: almacena resultado y metadatos JSON.
5. **Integraciones simuladas**: webhooks, email y Slack configurables.
6. **Scheduler periódico**: dispara todos los workflows cada 5 minutos.
7. **Panel de administración**: crear usuarios/organizaciones desde la UI.
8. **Prometheus metrics**: `/metrics` expuesto por el backend.
9. **Frontend sencillo**: login, registro, dashboard, workflows, administración
   e historial.

---

## 🧱 Arranque rápido con Docker

```bash
docker compose up --build
```

Esto levanta:
- PostgreSQL en `db` (puerto 5432)
- Backend FastAPI en `backend` (puerto 8000)
- Frontend en `frontend` (puerto 8080 mapeado a 80 de nginx)

El contenedor backend ejecuta automáticamente las migraciones sobre la base de
datos gracias al `entrypoint.sh`.

Visita la aplicación en **http://localhost:8080**.

---

## 🔐 Endpoints clave (backend)

| Ruta | Método | Descripción |
|------|--------|-------------|
| `/auth/register` | POST | registro (email, password, organization, is_admin) |
| `/auth/login` | POST | obtiene token JWT |
| `/auth/me` | GET | devuelve usuario actual |
| `/workflows` | GET/POST | listar/crear workflows |
| `/workflows/{id}` | PATCH | editar workflow |
| `/workflows/{id}/run` | POST | ejecutar workflow manualmente |
| `/workflows/{id}/executions` | GET | listar ejecuciones de workflow |
| `/dashboard` | GET | conteos de workflows y ejecuciones |
| `/admin/users` | GET/POST | gestión de usuarios (solo admins) |
| `/admin/organizations` | GET | listar organizaciones (solo admins) |
| `/metrics` | GET | métricas Prometheus expuestas |

Para llamadas autenticadas incluya el encabezado `Authorization: Bearer <token>`.

---

## 🛠 Migraciones (Alembic)

La carpeta `backend/alembic` contiene el entorno de migraciones. El script
`entrypoint.sh` ya corre `alembic upgrade head` al iniciar, así que en despliegues
no necesitas ejecutar nada adicional.

Si deseas crear una migración local:

```bash
cd backend
alembic revision --autogenerate -m "mensaje"
alembic upgrade head
```

Asegúrate de tener la base de datos accesible (`docker compose up -d db`).

---

## ⚙️ Configuración de entorno

Copia `.env.example` a `.env` y ajusta los valores necesarios.

| Variable | Propósito |
|----------|-----------|
| `ENV` | `development`, `staging`, `production` |
| `DATABASE_URL` | URL de PostgreSQL |
| `SECRET_KEY` | clave para JWT |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | vida del token |

Docker Compose carga automáticamente `.env`.

---

## 🧪 Desarrollo local

- Backend: `cd backend && uvicorn app.main:app --reload`
- Frontend (modo dev): `cd frontend && npm install && npm run dev`

Las dependencias están listadas en `backend/requirements.txt` y
`frontend/package.json`.

---

## 📦 Docker optimizado

Los Dockerfiles usan imágenes `python:3.11-slim` y `node:20` con etapas de
construcción para reducir tamaño. El frontend se construye y luego se sirve con
`nginx`.

---

## ☁️ Despliegue en producción

- **Heroku**: crea un `Procfile` con
  `web: uvicorn app.main:app --host=0.0.0.0 --port=${PORT}`.
- **AWS Fargate / ECS**: empuja la imagen a un repositorio (ECR) y usa el
  `docker-compose.yml` como referencia.
- **DigitalOcean App Platform**: sube el repositorio y configura las variables
  de entorno; la plataforma puede construir con el Dockerfile.

Recuerda definir `DATABASE_URL`, `SECRET_KEY`, etc. y dejar que el contenedor
migre la base de datos en el arranque.

---

## 🧾 Extras y recomendaciones

- Incluye un `.gitignore` adequado (venv, node_modules, archivos compilados).
- Asegura un `LICENSE` (MIT, Apache 2.0, etc.) si publicarás código abierto.
- Puedes añadir GitHub Actions para CI (lint, tests, build).
- Documenta en el README cualquier decisión de diseño o cómo extender el
  sistema.

---

## 🎯 Visión del proyecto

Esta base de código muestra cómo construir un SaaS de automatización empresarial
con características completas: multi‑tenant, gestión de usuarios, scheduler,
webhooks simulados, historial y métricas. Puede servir tanto como ejemplo de
aprendizaje como punto de partida real para un producto comercial.

> 💡 **Idea fuerte**: convierte flujos de integración en un servicio vendible.
  El código ya tiene todo lo necesario para arrancar y escalar un prototipo.

---

¡Adelante, clona el repositorio, juega con las migraciones y hazlo tuyo!
