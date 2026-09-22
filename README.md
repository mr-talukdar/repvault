# RepVault

RepVault is a workout tracking application for managing a personal fitness journey. It is being built as a full-stack learning project with a focus on secure authentication, API development, request validation, and maintainable TypeScript code.

The current repository contains the Express and TypeScript backend. The Next.js frontend is part of the planned full-stack architecture but is not included in this checkout yet.

## Features

### Implemented

- Express server written in TypeScript
- MongoDB connection through Mongoose
- User signup and signin endpoints
- Password hashing and comparison with bcrypt
- Request body validation with Zod
- JWT authentication middleware
- Protected user profile endpoint
- Password exclusion from profile responses
- Environment-based configuration

### Planned

- Workout creation endpoint
- Retrieval of workouts belonging to the authenticated user
- Expanded workout tracking functionality
- Next.js frontend

## Tech Stack

| Area              | Technology                                                               |
| ----------------- | ------------------------------------------------------------------------ |
| Frontend          | Next.js with TypeScript (planned; not present in the current repository) |
| Backend           | Node.js, Express, and TypeScript                                         |
| Database          | MongoDB with Mongoose                                                    |
| Authentication    | JSON Web Tokens (JWT)                                                    |
| Password security | bcrypt                                                                   |
| Validation        | Zod                                                                      |

## Project Structure

```text
RepVault/
├── server/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts
│       ├── middleware/
│       │   └── Authentication.ts
│       ├── models/
│       │   └── UserModel.ts
│       └── schema/
│           └── auth.schema.ts
└── README.md
```

## Prerequisites

- Node.js and npm
- A MongoDB deployment and connection credentials

## Installation

### Backend

1. Change to the server directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `server/.env` with the variables below:

   ```env
   PORT=3000
   MONGODB_USER=your_mongodb_username
   MONGODB_PWD=your_mongodb_password
   MONGODB_DB_NAME=your_database_name
   JWT_SECRET_KEY=your_jwt_secret
   ```

   Replace the placeholder values with your local configuration. Do not commit `.env` or real credentials to source control.

### Frontend

There is no frontend application or frontend package configuration in the current repository, so no frontend installation command is available yet. The frontend setup can be added when the Next.js application is introduced.

## Running Locally

From the `server` directory, start the development server with:

```bash
npm run dev
```

The server uses `PORT` when it is set and otherwise listens on port `3000`.

To compile the TypeScript backend without starting it:

```bash
npm run build
```

The compiled output is written to `server/dist/`.

## API Reference

The examples below assume the server is running at `http://localhost:3000`.

### Health check

```http
GET /
```

Authentication is not required.

Example response:

```json
{
  "message": "Your server is up and fetching"
}
```

### Sign up

```http
POST /signup
Content-Type: application/json
```

Authentication is not required.

Request body:

```json
{
  "name": "Example User",
  "email": "user@example.com",
  "age": 25,
  "mobile": 1234567890,
  "password": "example-password"
}
```

Validation requirements:

- `name`: string
- `email`: valid email address
- `age`: number
- `mobile`: number
- `password`: string with at least 4 characters

Successful response: `201 Created`

```json
{
  "message": "User Written"
}
```

Invalid request data returns `400 Bad Request`. Duplicate user data returns `409 Conflict`.

### Sign in

```http
POST /signin
Content-Type: application/json
```

Authentication is not required.

Request body:

```json
{
  "email": "user@example.com",
  "password": "example-password"
}
```

Validation requirements:

- `email`: valid email address
- `password`: string with at least 4 characters

Successful response: `200 OK`

```json
{
  "message": "you are logged in",
  "token": "<jwt-token>"
}
```

The response token must be sent as a Bearer token when accessing protected routes. Invalid request data returns `400 Bad Request`; unknown users return `404 Not Found`; invalid passwords return `401 Unauthorized`.

### Get profile

```http
GET /profile
Authorization: Bearer <jwt-token>
```

Authentication is required. The JWT authentication middleware verifies the token and uses its user ID to find the profile. The returned user document excludes the password field.

Successful response: `200 OK`

The response contains the authenticated user's stored profile fields, excluding `password`.

Requests without a token return `401 Unauthorized`. Invalid or expired tokens return `403 Forbidden`. A profile that cannot be found returns `404 Not Found`.

## Roadmap

- Add an authenticated workout creation endpoint.
- Add an endpoint to retrieve workouts for the authenticated user.
- Build out additional workout tracking capabilities.
- Add the Next.js TypeScript frontend.
- Add automated tests for authentication, validation, and workout workflows.

## Available Scripts

Run these commands from `server/`:

| Command         | Description                                      |
| --------------- | ------------------------------------------------ |
| `npm run dev`   | Starts the development server with `tsx watch`   |
| `npm run build` | Compiles the TypeScript source with `tsc`        |
| `npm test`      | Placeholder script; tests are not configured yet |
