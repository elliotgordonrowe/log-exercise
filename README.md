# Project Title

This repository contains a Node.js project using Express and Drizzle ORM for a MySQL database. It provides a REST API for managing companies, units, and inventories.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Node.js 12.x or higher must be installed.
- **MySQL (optional)**: If you want to be able to interact with a local MySQL database, make sure you have `mysql` installed on your machine.
- **pnpm**: This project uses pnpm for package management. Install pnpm via npm with `npm install -g pnpm`.

## Installation

Follow these steps to get your development environment set up:

1. **Clone the repository:**

```bash
git clone https://your-repository-url.git
cd your-repository-directory
```

2. **Install dependencies:**

```bash
 pnpm install
```

1. **Configure the database connection (if you want to connect to a local mysql database):**

   Update the database configuration settings with your MySQL credentials and database details. Modify the db.js file (or wherever your database configuration is stored):

```typescript
import mysql from "mysql2/promise";

const connection = mysql.createConnection({
  host: "localhost",
  user: "yourUsername",
  password: "yourPassword",
  database: "yourDatabaseName",
});

export default connection;
```

2. **Initialize the database:**

   Run the following command to create the database tables:

```bash
pnpm run db:generate
pnpm run db:push
```

3. **Start the dev server:**
4.

```bash
pnpm run dev
```

## Usage

Once the server is running, you can access the API at http://localhost:3000. Here are some example curl commands you can use to interact with the API:

- **Create a Company:**

```bash
curl -X POST http://localhost:3000/companies \
-H "Content-Type: application/json" \
-d '{"name": "Tech Innovations"}'
```

- **Get All Companies:**

```bash
  curl -X GET http://localhost:3000/companies
```

### Provided API Endpoints

| Method | Endpoint         | Description                   |
| ------ | ---------------- | ----------------------------- |
| POST   | /companies       | Create a new company.         |
| GET    | /companies       | Retrieve all companies.       |
| GET    | /companies/:id   | Retrieve a company by its ID. |
| PUT    | /companies/:id   | Update a company by its ID.   |
| DELETE | /companies/:id   | Delete a company by its ID.   |
| POST   | /units           | Create a new unit.            |
| GET    | /units           | Retrieve all units.           |
| GET    | /units/:id       | Retrieve a unit by its ID.    |
| POST   | /inventories     | Create new inventory.         |
| GET    | /inventories     | Retrieve all inventories.     |
| GET    | /inventories/:id | Retrieve an inventory by ID.  |
