# Technical Assignment: Inventory Log Feature

## Overview

This repository serves as the starting point for a technical assessment aimed at evaluating your backend development and TypeScript skills. Your task is to implement a logging feature for inventory activities within the provided system, which includes handling `companies`, `units`, and `inventories`.

## Objective

Develop a comprehensive log system that records all modifications to the inventory items. These modifications are expected to be triggered through various unimplemented endpoints such as `/book`, `/process`, `/send`, etc. The logs should be detailed enough to support a potential feature where the inventory state can be "rewound" back to any specific point in time based on the timestamp of the logs. While the implementation of the rewind feature itself is not required, completing it will be considered a plus.

## Requirements

- **Activity Logging**: Implement a system to log every change made to inventory items via the specified endpoints (`/book`, `/process`, `/send`). Each log entry should capture sufficient information such as the type of activity (booking, processing, sending), the date and time of the activity, the user responsible, and the before-and-after states of the inventory item.
- **Data Integrity**: Ensure that logs are immutable once written, to maintain a reliable audit trail.
- **Scalability**: Design the logging system to efficiently handle a large volume of inventory updates and queries.

## Expectations

- **Endpoint Implementation**: You are expected to implement the necessary endpoints (`/book`, `/process`, `/send`) that will handle the modifications to the inventories. These endpoints will trigger the logging of activities as described.

- **Flexibility**: You are encouraged to reorganize the existing codebase and architecture as you see fit to best implement the feature.
- **Code Quality**: Your code should follow best practices regarding readability, scalability, and reusability. Use appropriate design patterns and ensure your code is well-commented.
- **Documentation**: Update the README.md with instructions on how the logging system works, any setup required to get it running, and a detailed description of each endpoint's functionality.

## Submission

Upon completion of your assignment, please provide the URL of your forked repository by submitting it via the application process or emailing it to the contact provided in your interview invitation. This will facilitate the review of your code by our engineering team.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Node.js 12.x or higher must be installed.
- **MySQL (optional)**: If you want to be able to interact with a local MySQL database, make sure you have `mysql` installed on your machine.
- **pnpm**: This project uses pnpm for package management. Install pnpm via npm with `npm install -g pnpm`.

## Installation

Follow these steps to get your development environment set up:

1. **Clone the repository:**

```bash
git clone git@github.com:Circularise/log-exercise.git
cd log-exercise
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
