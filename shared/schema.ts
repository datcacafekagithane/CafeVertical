import { pgTable, text, serial, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const menuCategories = pgTable("menu_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameEn: text("name_en"),
  color: text("color"),
  image: text("image"),
  sortOrder: integer("sort_order").notNull(),
});

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  categoryId: integer("category_id").notNull(),
  iconName: text("icon_name"),
  image: text("image"),
  sortOrder: integer("sort_order").notNull(),
});

export const insertMenuCategorySchema = createInsertSchema(menuCategories).omit({
  id: true,
}).extend({
  nameEn: z.string().nullable(),
  color: z.string().nullable(),
  image: z.string().nullable(),
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
}).extend({
  iconName: z.string().nullable(),
  image: z.string().nullable(),
  description: z.string().nullable(),
});

export type MenuCategory = typeof menuCategories.$inferSelect;
export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuCategory = z.infer<typeof insertMenuCategorySchema>;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
