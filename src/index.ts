import express, { Request, Response } from "express";
import { dbPromise } from "./db/db";
import { companies, units, inventories, inventoryAudit } from "./db/schema";
import { and, desc, eq, gte } from "drizzle-orm";
import { MySqlTableWithColumns } from "drizzle-orm/mysql-core";

const app = express();
const PORT = 3000;

app.use(express.json());

function handleError(error: unknown): { message: string } {
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: "An unknown error occurred." };
}

const main = async () => {
  const db = await dbPromise;

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  // CRUD for Companies
  app.post("/companies", async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const newCompany = await db.insert(companies).values({ name });
      res.status(201).json(newCompany);
    } catch (error) {
      const errorMessage = handleError(error);
      res.status(400).json(errorMessage);
    }
  });

  app.get("/companies", async (req: Request, res: Response) => {
    try {
      const allCompanies = await db.select().from(companies);
      res.json(allCompanies);
    } catch (error) {
      const errorMessage = handleError(error);
      res.status(500).json(errorMessage);
    }
  });

  app.put("/companies/:id", async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const { id } = req.params;
      const updatedCompany = await db
        .update(companies)
        .set({ name })
        .where(eq(companies.id, id));
      res.json(updatedCompany);
    } catch (error) {
      const errorMessage = handleError(error);
      res.status(400).json(errorMessage);
    }
  });

  app.delete("/companies/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await db.delete(companies).where(eq(companies.id, id));
      res.status(204).send();
    } catch (error) {
      const errorMessage = handleError(error);
      res.status(500).json(errorMessage);
    }
  });

  // CRUD for Units
  app.post("/units", async (req: Request, res: Response) => {
    try {
      const { name, companyId } = req.body;
      const newUnit = await db.insert(units).values({ name, companyId });
      res.status(201).json(newUnit);
    } catch (error) {
      const errorMessage = handleError(error);
      res.status(400).json(errorMessage);
    }
  });

  app.get("/units", async (req: Request, res: Response) => {
    try {
      const allUnits = await db.select().from(units);
      res.json(allUnits);
    } catch (error) {
      const errorMessage = handleError(error);
      res.status(500).json(errorMessage);
    }
  });

  app.get("/units/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const unit = await db.select().from(units).where(eq(units.id, id));
      if (unit.length > 0) {
        res.json(unit[0]);
      } else {
        res.status(404).json({ message: "Unit not found" });
      }
    } catch (error) {
      const errorMessage = handleError(error);
      res.status(500).json(errorMessage);
    }
  });

  // CRUD for Inventories
  app.post("/inventories", async (req: Request, res: Response) => {
    try {
      const { quantity, unitId, productTypeId } = req.body;
      const newInventory = await db
        .insert(inventories)
        .values({ quantity, unitId, productTypeId });
      const log = {
        id: newInventory[0].insertId.toString(),  // Unfortunately, this does not work with a string ID field
        action: Action.Create,
        body: {
          quantity,
          unitId,
          productTypeId
        }
      };
      await logData(log);
      res.status(201).json(newInventory);
    } catch (error) {
      const errorMessage = handleError(error);
      res.status(400).json(errorMessage);
    }
  });

  app.get("/inventories", async (req: Request, res: Response) => {
    try {
      const allInventories = await db.select().from(inventories);
      res.json(allInventories);
    } catch (error) {
      const errorMessage = handleError(error);
      res.status(500).json(errorMessage);
    }
  });

  app.get("/inventories/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const inventory = await db
        .select()
        .from(inventories)
        .where(eq(inventories.id, id));
      if (inventory.length > 0) {
        res.json(inventory[0]);
      } else {
        res.status(404).json({ message: "Inventory not found" });
      }
    } catch (error) {
      const errorMessage = handleError(error);
      res.status(500).json(errorMessage);
    }
  });

  app.get("/logs", async (req: Request, res: Response) => {
    try {
      // Default to all logs if no start date was passed in
      const date = new Date(req.query.startDate?.toString() ?? '0');
      const logs = await db
        .select()
        .from(inventoryAudit)
        .where(gte(inventoryAudit.timestamp, date));
      if (logs.length > 0) {
        res.status(200).json(logs);
      } else {
        res.status(404).json({ message: "Logs not found" });
      }
    } catch (error) {
      const errorMessage = handleError(error);
      res.status(500).json(errorMessage);
    }
  });
  
  app.get("/logs/:userId", async (req: Request, res: Response) => {
    try {
      // Default to all logs if no start date was passed in
      const date = new Date(req.query.startDate?.toString() ?? '0');
      const logs = await db
        .select()
        .from(inventoryAudit)
        .where(
          and(
            gte(inventoryAudit.timestamp, date),
            eq(inventoryAudit.author, req.params.id)
          )
        );
      if (logs.length > 0) {
        res.status(200).json(logs);
      } else {
        res.status(404).json({ message: "Logs not found" });
      }
    } catch (error) {
      const errorMessage = handleError(error);
      res.status(500).json(errorMessage);
    }
  });

  app.put("/inventories/rewind", async (req: Request, res: Response) => {
    try {
      const hash: {[id: string]: Log} = {};
      const date = new Date(req.query.startDate?.toString() ?? '0');
      // Get all logs in descending order
      const logs = await db
        .select()
        .from(inventoryAudit)
        .where(gte(inventoryAudit.timestamp, date))
        .orderBy(desc(inventoryAudit.timestamp));
      
      // Return early if there's nothing to do
      if (logs.length === 0) {
        res.status(400);
        return;
      }

      // Create the hash to store values to which the records will ultimately be updated to
      for (let i = 0; i < logs.length; i++) {
        hash[logs[i].id] = JSON.parse(logs[i].newValue);
      }

      // Drizzle apparently does not support batch calls for MySQL
      for (let recordId in hash) {
        // Is this all or nothing? Should we keep going if one update fails?
        await db
          .update(inventories)
          .set(hash[recordId])
          .where(eq(inventories.id, recordId));
      }
      res.status(200);
    } catch (error) {
      const errorMessage = handleError(error);
      res.status(500).json(errorMessage);
    }
  });
  
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });

  
  async function logData(logValues: Log, table: MySqlTableWithColumns<any> = inventoryAudit): Promise<void> {
    const newValue = JSON.stringify(logValues.body);
    const newLog = {
      id: logValues.id,
      action: logValues.action,
      newValue,
      author: logValues.author ?? 'myUser'
    }
    await db.insert(table).values(newLog);
  }
};

main();

export interface Log {
  id: string,
  action: Action,
  body: any,
  author?: string
}

export enum Action {
  Create,
  Update,
  Delete
}
