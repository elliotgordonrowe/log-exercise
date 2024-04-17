import express, { Request, Response } from "express";
import { dbPromise } from "./db/db";
import { companies, units, inventories } from "./db/schema";
import { eq } from "drizzle-orm";

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

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
};

main();
