# Technical Assignment: Inventory Log Feature

## Overview

This repository serves as the starting point for a technical assessment aimed at evaluating your backend development and TypeScript skills. Your task is to implement a logging feature for inventory activities within the provided system.

## Objective

Develop a comprehensive log system that records all modifications to the inventory items. These modifications are expected to be triggered through various unimplemented `/inventories` endpoints such as `/book`, `/process`, `/send`, etc. The logs should be detailed enough to support a potential feature where the inventory state can be "rewound" back to any specific point in time based on the timestamp of the logs. While the implementation of the rewind feature itself is not required, completing it will be considered a plus.

## Requirements

Implement a system to log every change made to inventory items via (uninemplemented) endpoints (e.g. `/book`, `/process`, `/send`). Each log entry should capture sufficient information such as the type of activity, the date and time of the activity, the user responsible, and the before-and-after states of the inventory item(s). The inventory operations may be extended and modified in the future, so the log system need to be flexible enough to handle that. 

## Expectations

- **Log Implementation**: You are expected to implement the database schema(s) that will handle the log feature, as well as the business logic to create and manage logs for inventory operations. Optionally, if you have time, you may implement the logic of rewinding logs to a get the inventory back to its state at a specific timestmap. 
- **Flexibility**: You are encouraged to reorganize the existing codebase and architecture as you see fit to best implement the feature.
- **Code Quality**: Your code should follow best practices regarding readability, scalability, and reusability. Use appropriate design patterns and ensure your code is well-commented. The provided codebase shouldn't be considered as a reference for best practices.
- **Documentation**: Update the README.md with instructions on how the logging system works if necessary.

## Submission

Upon completion of your assignment, please provide the URL of your forked repository by emailing it to the contact provided.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Node.js 12.x or higher must be installed.
- **MySQL (optional)**: If you want to be able to interact with a local MySQL database, make sure you have `mysql` installed on your machine, create a new database and configure the appropriate credentials in `/db/db.ts`.
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

   Update the database configuration settings with your MySQL credentials and database details. Modify the `/db/db.ts` file:

```typescript
const connection = mysql.createConnection({
  host: "localhost",
  user: "yourUsername",
  password: "yourPassword",
  database: "yourDatabaseName",
});
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

- **Example: Create a Company:**

```bash
curl -X POST http://localhost:3000/companies \
-H "Content-Type: application/json" \
-d '{"name": "Tech Innovations"}'
```

- **Example: Get All Companies:**

```bash
  curl -X GET http://localhost:3000/companies
```

### Provided API Endpoints

Those are provided as a starter and to help populate the database if needed.

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


## Design
Store each record change to an Audit table for each table that we want to keep an audit trail of. The Audit table has the following structure:

| Timestamp          | ID           | Action                                       | NewValue                        | Author                                                  |
| UTC Time of change | ID of record | Action taken on the record (add/edit/delete) | Stringified new value of record | Author of change (user taken from authentication token) |

The new value of the record can be returned by the DB upon successful record modification. This result can then be stringified and stored in the NewValue column. This allows for the log function to be easily extended by consumers to save whatever state is needed. The function is written to be able to log to multiple different audit tables. For rewinding, we simply:

SELECT * 
FROM InventoryAudit 
WHERE Timestamp > SOME_TIMESTAMP 
ORDER BY DESC;

We then play the changes in reverse, modifying the records in-memory until we playback the first change at which point we commit the result (update the DB) via either bulk edit (preferable) or singular edits to the table.

Apparently drizzle with MySQL does not support returning the last inserted record when the ID is not auto-incremented (i.e. when it is a string). This seems like it should be basic functionality but I do not have the time to investigate an alternative design. Additionally, Drizzle does not support batch calls for MySQL.