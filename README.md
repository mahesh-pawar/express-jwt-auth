# Express JWT Auth

A REST API for user registration, login, and authentication built with Express.js, JWT, and SQLite (PostgreSQL-ready).

## Features

- User registration with hashed passwords (bcrypt)
- Login with JWT-based authentication
- Protected route to fetch the current authenticated user
- Request validation using `express-validator`
- MVC-style project structure (models, controllers, middleware, routes)
- SQLite for local development, with PostgreSQL migration planned

## Tech Stack

| Layer          | Technology                                     |
|----------------|------------------------------------------------|
| Runtime        | Node.js                                        |
| Framework      | Express.js                                     |
| Database       | SQLite (`better-sqlite3`) — PostgreSQL planned |
| Auth           | JSON Web Tokens (`jsonwebtoken`)               |
| Password hash  | `bcryptjs`                                     |
| Validation     | `express-validator`                            |
| Config         | `dotenv`                                       |

## Project Structure

```
.
├── controllers/
│   └── authController.js      # Register, login, and me logic
├── middleware/
│   └── authMiddleware.js       # JWT verification (requireAuth)
├── models/
│   └── userModel.js            # DB queries for users
├── routes/
│   └── authRoutes.js           # /api/auth/* route definitions
├── validators/
│   └── authValidator.js        # Input validation rules
├── db.js                       # SQLite connection and table setup
├── server.js                   # App entry point
├── .env.example
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

```bash
git clone https://github.com/mahesh-pawar/express-jwt-auth.git
cd express-jwt-auth
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable      | Description                                | Example              |
|---------------|--------------------------------------------|----------------------|
| `PORT`        | Port the server listens on                 | `3000`               |
| `SALT_ROUNDS` | bcrypt salt rounds for password hashing    | `10`                 |
| `JWT_SECRET`  | Secret key used to sign JWTs               | `your_random_secret` |

> Generate a strong `JWT_SECRET` with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### Running the Server

```bash
npm start
```

The server will start on `http://localhost:3000` (or the port set in `.env`).

Check it's running:

```bash
curl http://localhost:3000/status
```

## API Reference

Base URL: `/api/auth`

### Register

```
POST /api/auth/register
```

**Request body:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securePass123"
}
```

**Success response — `201 Created`:**

```json
{
  "status": "success",
  "message": "User successfully registered",
  "data": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

**Error responses:**

| Status | Code                  | Meaning                                   |
|--------|-----------------------|-------------------------------------------|
| 400    | `VALIDATION_ERROR`    | Missing/invalid name, email, or password  |
| 409    | `EMAIL_ALREADY_EXISTS`| An account with this email already exists |

---

### Login

```
POST /api/auth/login
```

**Request body:**

```json
{
  "email": "jane@example.com",
  "password": "securePass123"
}
```

**Success response — `200 OK`:**

```json
{
  "status": "success",
  "message": "User successfully logged in",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error responses:**

| Status | Code                  | Meaning                           |
|--------|-----------------------|-----------------------------------|
| 400    | `VALIDATION_ERROR`    | Missing/invalid email or password |
| 401    | `INVALID_CREDENTIALS` | Email or password is incorrect    |

---

### Get Current User

```
GET /api/auth/me
```

Requires an `Authorization` header with a valid JWT:

```
Authorization: Bearer <token>
```

**Success response — `200 OK`:**

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

**Error responses:**

| Status | Code             | Meaning                                 |
|--------|------------------|-----------------------------------------|
| 401    | `UNAUTHORIZED`   | Missing, invalid, or expired token      |
| 404    | `USER_NOT_FOUND` | Token valid but user no longer exists   |

## Error Response Format

All errors follow a consistent shape:

```json
{
  "status": "error",
  "code": "ERROR_CODE",
  "message": "Human-readable description"
}
```

Validation errors include an additional `errors` array with per-field detail:

```json
{
  "status": "error",
  "code": "VALIDATION_ERROR",
  "message": "The request contains invalid or missing fields",
  "errors": [
    { "field": "email", "code": "INVALID_FORMAT", "message": "Please provide a valid email address" }
  ]
}
```

## License

MIT
