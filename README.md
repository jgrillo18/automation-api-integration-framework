# Automation API Integration Framework (SaaS)

**Fin real del repositorio:**

Plataforma para conectar sistemas empresariales aislados, automatizar procesos
repetitivos y convertir integración técnica en un servicio facturable. El objetivo es
dejar a las empresas decir cosas como "cuando se cree una orden en el ERP, mándala
a CRM" y que todo pase sin intervención humana.

## Características principales

1. **Autenticación multi-tenant**: cada organización tiene su espacio aislado.
2. **Gestión de workflows**: crear y listar automatizaciones por organización.
3. **Motor de ejecución**: workflows se ejecutan con reintentos, logs JSON, manejo de errores.
4. **Scheduler**: job periódico cada 5 minutos que dispara todos los workflows.
5. **Dashboard básico**: consulta de cantidad de workflows y ejecuciones por tenant.
6. **Arquitectura Dockerizada**: backend, frontend y Postgres listos para levantarse con Compose.

## Estructura del proyecto

```
automation-api-integration-framework/
├── backend/    # API en FastAPI + SQLAlchemy
├── frontend/   # SPA en React (Vite)
└── docker-compose.yml
```

## Requisitos

- Docker & Docker Compose
- Python 3.11 (solo para desarrollo del backend fuera de contenedor)
- Node 18+ (solo para desarrollo del frontend fuera de contenedor)

## Backend

1. `cd backend`
2. `pip install -r requirements.txt`
3. `uvicorn app.main:app --reload`

La base de datos Postgres se configura mediante `DATABASE_URL` en `app/core/config.py`.

### Endpoints principales

- `POST /auth/register` Registro (email, password, organization)
- `POST /auth/login` Login devuelve token JWT
- `GET /workflows/` Lista workflows del tenant
- `POST /workflows/` Crea workflow (name, type)
- `GET /dashboard/` Obtiene conteos de workflows y ejecuciones

El token se envía con `Authorization: Bearer <token>`.

## Frontend

React simple con páginas de login, dashboard y workflows. Ajustar según necesidades.

> El frontend se sirve con Nginx en el puerto **80** dentro del contenedor.
> Dado que en Windows el puerto 80 suele estar reservado, la configuración de
> Docker Compose mapea `8080:80` por defecto.  Usa `http://localhost:8080` en el
> navegador para ver la aplicación (antes utilizábamos 5173 en modo desarrollo).

## Inicializar con Docker

```bash
docker compose up --build
```

Esto iniciará Postgres, el backend y el frontend.

## Migraciones de base de datos

La gestión del esquema se realiza con **Alembic**. Los archivos de configuración
están en `backend/alembic` y el `alembic.ini` en la raíz del proyecto.

# Para crear o aplicar migraciones:

1. copia el fichero de ejemplo: `cp .env.example .env` y ajusta valores si es necesario
2. arranca la base de datos (`docker compose up -d db`) o ten un Postgres accesible
3. ejecuta los comandos desde el directorio `backend`:

```bash
cd backend
alembic revision --autogenerate -m "tu mensaje"
alembic upgrade head
```

> La imagen de Docker ya incluye un *entrypoint* que corre `alembic upgrade head`
> automáticamente al iniciar el contenedor, así que en despliegues en la nube no
> tienes que preocuparte de ejecutar migraciones manualmente.


El `env.py` ya está preparado para leer `DATABASE_URL` desde los ajustes y usar
los metadatos de `app.core.database.Base`.

> El código de inicio (`app/main.py`) sólo ejecuta `Base.metadata.create_all` si
> `ENV=development`, de modo que en entornos de staging/producción usas las
> migraciones.

## Configuración por entorno

Las variables se definen en un archivo `.env` (mira `.env.example`).
`app/core/config.py` utiliza `pydantic-settings` para leer:

```python
ENV: str = "development"  # development|staging|production
DATABASE_URL: str
SECRET_KEY: str
ACCESS_TOKEN_EXPIRE_MINUTES: int
```

Cambia `ENV` para comportamientos distintos y no olvide usar la misma .env en
los contenedores (Docker Compose lee automáticamente `.env`).

## Contenedores optimizados

Los Dockerfiles fueron convertidos a imágenes más ligeras y multitarea:

- **backend** usa `python:3.11-slim` y sólo copia la app tras instalar
  dependencias.
- **frontend** está listo para construir con Node y servir la versión de
  producción con un servidor ligero (puedes añadir un stage `nginx` si quieres).

Esto reduce el tamaño y mejora el tiempo de despliegue.

## Despliegue en la nube

La aplicación puede empacarse como servicio Docker y subirse a cualquier
proveedor (Heroku, AWS Fargate, DigitalOcean App Platform, etc.).

- **Heroku**: añade un `Procfile` con
  `web: uvicorn app.main:app --host=0.0.0.0 --port=${PORT}`.
- **AWS Fargate / ECS**: utiliza el `docker-compose.yml` como referencia para
  los servicios, crea una imagen con `docker build` y empújala a ECR.
- **DigitalOcean**: el panel permite cargar tu `docker-compose.yml` o
  configurar un `Dockerfile` directo.

Cualquier servicio debe definir variables de entorno (`DATABASE_URL`,
`SECRET_KEY`, etc.) y dejar que Alembic aplique las migraciones durante el
arranque (por ejemplo, ejecutando `alembic upgrade head` en `entrypoint`).

---

## Desarrollo y visión

El repositorio es la base de un SaaS tipo Zapier empresarial. Permite vender
servicios de integración (ERP ↔ CRM, facturación, sincronización de inventario, etc.)
como producto por suscripción. Con funcionalidades multitennant, scheduler, motor de
workflows y un dashboard básico, el código es una caja de herramientas para
automatización empresarial.

> 🚀 Este no es un simple proyecto de portafolio: es una *máquina para facturar
> automatización*.  
