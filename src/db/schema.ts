import {
  mysqlTable,
  serial,
  varchar,
  decimal,
  timestamp,
} from "drizzle-orm/mysql-core";
import { relations, sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

export const companies = mysqlTable("companies", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar("name", { length: 256 }).notNull(),
  createdAt: timestamp("createdAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .onUpdateNow()
    .notNull(),
});

export type Company = typeof companies.$inferSelect;

export const companiesRelations = relations(companies, ({ one, many }) => ({
  units: many(units),
}));

export const units = mysqlTable("units", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar("name", { length: 256 }).notNull(),
  companyId: varchar("companyId", { length: 128 }).notNull(),
  createdAt: timestamp("createdAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .onUpdateNow()
    .notNull(),
});

export type Unit = typeof units.$inferSelect;

export const unitsRelations = relations(units, ({ one, many }) => ({
  company: one(companies, {
    fields: [units.companyId],
    references: [companies.id],
  }),
  inventories: many(inventories),
}));

export const inventories = mysqlTable("inventories", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  quantity: decimal("quantity").notNull(),
  unitId: varchar("unitId", { length: 128 }).notNull(),
  productTypeId: varchar("productTypeId", { length: 128 }).notNull(),
  createdAt: timestamp("createdAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .onUpdateNow()
    .notNull(),
});

export type Inventory = typeof inventories.$inferSelect;

export const inventoriesRelations = relations(inventories, ({ one }) => ({
  unit: one(units, {
    fields: [inventories.unitId],
    references: [units.id],
  }),
}));
