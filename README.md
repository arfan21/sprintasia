## Getting Started <a name = "getting_started"></a>

### Database Diagram

### API Specification

### Backend

#### Set env ./be/.env

```
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=

JWT_SECRET=
JWT_ALGO=HS256
```

#### Run Migration

```
cd be
php artisan migrate
```

#### Run Server

```
cd be
php artisan serve
```
