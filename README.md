# 🛒 eCommerce Backend API

<p align="left">
  <a href="https://github.com/nil2022/ecommerce/actions/workflows/github-code-scanning/codeql" target="_blank">
    <img src="https://github.com/nil2022/ecommerce/actions/workflows/github-code-scanning/codeql/badge.svg?branch=master" alt="CodeQL" />
  </a>
  <img src="https://img.shields.io/badge/node-%3E%3D22-brightgreen" alt="Node >=22" />
  <img src="https://img.shields.io/badge/license-ISC-blue" alt="License: ISC" />
</p>

A **Node.js / Express** REST API for an e-commerce backend. It provides authentication,
role-based access control, and management for categories, products, shopping carts, and user
accounts (registration plus admin-only listing) — backed by **MySQL** (via **Sequelize ORM**)
with **Redis** integration.

---

## 📚 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Configuration](#-environment-configuration)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [API Reference](#-api-reference)
  - [Authentication](#authentication)
  - [Auth Routes](#auth-routes)
  - [Category Routes](#category-routes)
  - [Product Routes](#product-routes)
  - [Cart Routes](#cart-routes)
- [Project Scripts](#-project-scripts)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- **JWT Authentication** — sign-up, login, logout, and password change with signed access tokens.
- **Role-Based Access Control** — `Customer`, `Admin`, and `SuperAdmin` roles enforced via middleware.
- **User Management** — registration with automatic cart creation and admin-only user listing.
- **Category Management** — full CRUD (admin restricted for write operations).
- **Product Management** — create, read, update, delete, filter, and paginated listing.
- **Shopping Cart** — update and retrieve a cart by id.
- **Redis Integration** — a Redis client writes user data to the store on login.
- **Input Validation** — request payloads validated with **Joi**.
- **Environment Validation** — strongly typed config via **Envalid**.
- **Auto Database Bootstrap** — the database and default admin are created/seeded on startup.
- **Structured Logging & Security** — `morgan` HTTP logging, CORS, and cookie parsing.

---

## 🧰 Tech Stack

| Layer        | Technology                                            |
| ------------ | ----------------------------------------------------- |
| Runtime      | Node.js (>= 22, ESM modules)                          |
| Framework    | Express 5                                             |
| ORM / DB     | Sequelize 6 + MySQL (`mysql2`)                        |
| Cache / Redis| `redis` client (user data written on login)           |
| Auth         | JSON Web Tokens (`jsonwebtoken`), `bcrypt` hashing    |
| Validation   | Joi, Envalid                                          |
| Middleware   | cors, cookie-parser, morgan                           |
| Testing      | Jest, Supertest                                       |
| Formatting   | Prettier                                              |

---

## 📁 Project Structure

```text
ecommerce/
├── src/
│   ├── index.js              # Application entry point (DB sync + bootstrap + listen)
│   ├── app.js                # Express app, middleware, route mounting
│   ├── constants.js
│   ├── configs/              # Database & Sequelize configuration
│   ├── controllers/          # Request handlers (auth, product, category, cart)
│   ├── middlewares/          # JWT auth, role checks, validation
│   ├── models/               # Sequelize models (User, Role, Category, Product, Cart)
│   ├── routes/               # Express routers
│   └── utils/                # Env, redis, response, helpers, validation, cron
├── tests/                    # Jest test suites (controllers, routes)
├── .env / .env.sample        # Environment configuration
└── package.json
```

---

## ✅ Prerequisites

- **Node.js** >= 22
- **MySQL** server (default port `3306`)
- **Redis** server (default `redis://localhost:6379`)
- `npm` (bundled with Node.js)

---

## 🛠 Installation

```bash
# 1. Clone the repository
git clone https://github.com/nil2022/ecommerce.git
cd ecommerce

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.sample .env
# then edit .env with your database, redis, and secret values
```

---

## 🔧 Environment Configuration

Copy `.env.sample` to `.env` and adjust the values. All variables are validated at startup
by **Envalid**, so a missing/invalid value will fail fast.

| Variable                  | Default                | Description                                      |
| ------------------------- | ---------------------- | ------------------------------------------------ |
| `PORT`                    | `9000`                 | Port the server listens on                       |
| `NODE_ENV`                | `dev`                  | Environment (`dev`, `prod`, `test`)              |
| `CORS_ORIGIN`             | _(empty)_              | Allowed CORS origin                              |
| `CORS_ALLOWED_HEADERS`    | _(empty)_              | Comma-separated allowed headers                  |
| `ACCESS_TOKEN_SECRET`     | `secret`               | Secret used to sign JWTs                         |
| `ACCESS_TOKEN_EXPIRY`     | `7d`                   | Access token expiry duration                     |
| `DB_HOST`                 | `localhost`            | MySQL host                                       |
| `DB_USER`                 | `root`                 | MySQL username                                   |
| `DB_PASSWORD`             | `root`                 | MySQL password                                   |
| `DB_NAME`                 | `ecomm`                | MySQL database name                              |
| `DB_PORT`                 | `3306`                 | MySQL port                                       |
| `DB_SSL`                  | `false`                | Use SSL for the database connection              |
| `REDIS_URL`               | `redis://localhost:6379` | Redis connection URL                           |
| `SYSTEM_ADMIN_USERID`     | `john`                 | System/admin bootstrap user ID                   |
| `SYSTEM_ADMIN_PASSWORD`   | `12345678`             | System/admin bootstrap password                  |
| `SYSTEM_ADMIN_EMAIL`      | `john@email.com`      | System/admin bootstrap email                     |

---

## 🗄 Database Setup

No manual migrations are required. On startup the application will:

1. Create the database (`DB_NAME`) if it does not already exist (using the configured DB host/port).
2. Authenticate the Sequelize connection.
3. Synchronize all models (creating tables that do not exist — **non-destructive**; runs on every startup).
4. Seed default data via `initialize()` **only when a given table is empty**:
   - **Roles:** `Customer`, `Admin`, `SuperAdmin`
   - **Category:** `Beauty`
   - **Product:** `MakeUP Kit` (cost `870`, quantity `20`, under the Beauty category)
   - **System Administrator:** created from `SYSTEM_ADMIN_USERID` / `SYSTEM_ADMIN_PASSWORD` / `SYSTEM_ADMIN_EMAIL`, assigned the `SuperAdmin` role, with an associated cart.

```bash
# Start the server (this triggers the bootstrap above)
npm start
```

---

## 🚀 Running the Application

```bash
# Development mode (hot reload via Node --watch)
npm run dev

# Production start
npm start

# Run the test suite
npm test

# Run tests with coverage
npm run test:cov
```

The server will be available at `http://localhost:<PORT>` (default `9000`).

---

## 📡 API Reference

All routes are mounted under the following base paths:

- `/auth`
- `/category`
- `/product`
- `/cart`

### Authentication

Most endpoints require a valid access token. The token is read from (in order of precedence):

- The `accessToken` cookie, **or**
- The `Authorization: Bearer <token>` header, **or**
- The `x-access-token` header.

Admin-only endpoints additionally require the authenticated user to hold the `Admin` or
`SuperAdmin` role.

---

### Auth Routes — `/auth`

| Method | Endpoint                | Auth | Admin | Description                                  |
| ------ | ----------------------- | :--: | :---: | -------------------------------------------- |
| `POST` | `/auth/register`        |      |       | Register a new user (auto-creates a cart).   |
| `POST` | `/auth/login`           |      |       | Authenticate and receive an access token.    |
| `GET`  | `/auth/all-users`       |  ✅  | Super  | List all users (SuperAdmin only).            |
| `PATCH`| `/auth/change-password` |  ✅  |       | Change the logged-in user's password.        |
| `GET`  | `/auth/logout`          |  ✅  |       | Clear the auth cookie / log out.             |

**Register body**

```json
{
  "fullName": "John Doe",
  "userId": "john",
  "email": "john@example.com",
  "password": "secret123",
  "roles": [1]
}
```

**Login body**

```json
{ "userId": "john", "password": "secret123" }
```

---

### Category Routes — `/category`

| Method   | Endpoint                   | Auth | Admin | Description                     |
| -------- | -------------------------- | :--: | :---: | ------------------------------- |
| `POST`   | `/category/add`            |  ✅  |  ✅   | Create a new category.          |
| `GET`    | `/category/getAll`         |  ✅  |       | List all categories.            |
| `GET`    | `/category/getOne`         |  ✅  |       | Get a category by query `id`.   |
| `PATCH`  | `/category/updateOne`      |  ✅  |  ✅   | Update a category.              |
| `DELETE` | `/category/deleteOne`      |  ✅  |  ✅   | Delete a category.              |

---

### Product Routes — `/product`

| Method   | Endpoint                  | Auth | Admin | Description                      |
| -------- | ------------------------- | :--: | :---: | -------------------------------- |
| `POST`   | `/product/add`            |  ✅  |  ✅   | Create a new product.            |
| `GET`    | `/product/getAll`         |  ✅  |       | List all products.               |
| `GET`    | `/product/filter`         |  ✅  |       | Filter products by query params. |
| `GET`    | `/product/getOne`         |  ✅  |       | Get a product by query `id`.     |
| `PATCH`  | `/product/updateOne`      |  ✅  |  ✅   | Update a product.                |
| `DELETE` | `/product/deleteOne`      |  ✅  |  ✅   | Delete a product.                |

---

### Cart Routes — `/cart`

| Method | Endpoint        | Auth | Admin | Description                          |
| ------ | --------------- | :--: | :---: | ------------------------------------ |
| `PUT`  | `/cart/:id`     |  ✅  |       | Update the cart for user `:id`.      |
| `GET`  | `/cart/:id`     |  ✅  |       | Retrieve the cart for user `:id`.    |

> ⚠️ **Authorization note:** These routes only require a valid token; they do **not** verify
> that the authenticated user owns the cart identified by `:id`. Any authenticated user can
> currently read or modify another user's cart (insecure direct object reference). Enforcing
> ownership (or admin access) is recommended before production use.

---

## 📦 Project Scripts

| Script          | Command                                               | Purpose                              |
| --------------- | ----------------------------------------------------- | ------------------------------------ |
| `dev`           | `node --env-file=.env --watch src/index.js`           | Run in development with hot reload.  |
| `start`         | `node --env-file=.env src/index.js`                   | Run in production.                   |
| `test`          | `jest --verbose --runInBand --detectOpenHandles --forceExit` | Run the Jest test suite.      |
| `test:cov`      | `cross-env NODE_ENV=test jest --coverage`             | Run tests with coverage reporting.   |

---

## 🤝 Contributing

Contributions are welcome! If you find any issues or have suggestions for improvement,
please open an issue or submit a pull request.

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/my-feature`).
3. Commit your changes (`git commit -m 'Add my feature'`).
4. Push to the branch (`git push origin feature/my-feature`).
5. Open a pull request.

---

## 📄 License

This project is licensed under the **ISC** License.
