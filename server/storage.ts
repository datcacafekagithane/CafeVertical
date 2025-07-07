import { menuCategories, menuItems, type MenuCategory, type MenuItem, type InsertMenuCategory, type InsertMenuItem } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getMenuCategories(): Promise<MenuCategory[]>;
  getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]>;
  getAllMenuItems(): Promise<MenuItem[]>;
  createMenuCategory(category: InsertMenuCategory): Promise<MenuCategory>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuCategory(id: number, category: Partial<InsertMenuCategory>): Promise<MenuCategory>;
  updateMenuItem(id: number, item: Partial<InsertMenuItem>): Promise<MenuItem>;
  deleteMenuCategory(id: number): Promise<void>;
  deleteMenuItem(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getMenuCategories(): Promise<MenuCategory[]> {
    const categories = await db.select().from(menuCategories).orderBy(menuCategories.sortOrder);
    return categories;
  }

  async getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]> {
    const items = await db.select().from(menuItems).where(eq(menuItems.categoryId, categoryId)).orderBy(menuItems.sortOrder);
    return items;
  }

  async getAllMenuItems(): Promise<MenuItem[]> {
    const items = await db.select().from(menuItems).orderBy(menuItems.sortOrder);
    return items;
  }

  async createMenuCategory(insertCategory: InsertMenuCategory): Promise<MenuCategory> {
    const [category] = await db.insert(menuCategories).values(insertCategory).returning();
    return category;
  }

  async createMenuItem(insertItem: InsertMenuItem): Promise<MenuItem> {
    const [item] = await db.insert(menuItems).values(insertItem).returning();
    return item;
  }

  async updateMenuCategory(id: number, updateCategory: Partial<InsertMenuCategory>): Promise<MenuCategory> {
    const [category] = await db
      .update(menuCategories)
      .set(updateCategory)
      .where(eq(menuCategories.id, id))
      .returning();
    return category;
  }

  async updateMenuItem(id: number, updateItem: Partial<InsertMenuItem>): Promise<MenuItem> {
    const [item] = await db
      .update(menuItems)
      .set(updateItem)
      .where(eq(menuItems.id, id))
      .returning();
    return item;
  }

  async deleteMenuCategory(id: number): Promise<void> {
    await db.delete(menuCategories).where(eq(menuCategories.id, id));
  }

  async deleteMenuItem(id: number): Promise<void> {
    await db.delete(menuItems).where(eq(menuItems.id, id));
  }
}

export class MemStorage implements IStorage {
  private categories: Map<number, MenuCategory>;
  private items: Map<number, MenuItem>;
  private currentCategoryId: number;
  private currentItemId: number;

  constructor() {
    this.categories = new Map();
    this.items = new Map();
    this.currentCategoryId = 1;
    this.currentItemId = 1;
    this.seedData();
  }

  private seedData() {
    // Kategoriler
    const categories = [
      { id: 1, name: "Sıcak İçecekler", nameEn: "hot-drinks", color: "orange", image: null, sortOrder: 1 },
      { id: 2, name: "Soğuk İçecekler", nameEn: "cold-drinks", color: "blue", image: null, sortOrder: 2 },
      { id: 3, name: "Tostlar", nameEn: "toasts", color: "yellow", image: null, sortOrder: 3 },
      { id: 4, name: "Sandviçler", nameEn: "sandwiches", color: "green", image: null, sortOrder: 4 },
      { id: 5, name: "Salatalar", nameEn: "salads", color: "red", image: null, sortOrder: 5 },
    ];

    categories.forEach(category => {
      this.categories.set(category.id, category);
      this.currentCategoryId = Math.max(this.currentCategoryId, category.id + 1);
    });

    // Menü öğeleri
    const items = [
      // Sıcak İçecekler
      { id: 1, name: "Americano", description: "Klassik Americano", price: "25.00", categoryId: 1, iconName: "Coffee", image: "/attached_assets/Americano_1751636215832.JPG", sortOrder: 1 },
      { id: 2, name: "Cappuccino", description: "Köpüklü cappuccino", price: "30.00", categoryId: 1, iconName: "Coffee", image: "/attached_assets/Cappuccino_1751636215832.jpg", sortOrder: 2 },
      { id: 3, name: "Çay", description: "Sıcak çay", price: "10.00", categoryId: 1, iconName: "Coffee", image: "/attached_assets/Çay_1751636215833.jpg", sortOrder: 3 },
      
      // Soğuk İçecekler
      { id: 4, name: "Ayran", description: "Taze ayran", price: "8.00", categoryId: 2, iconName: "Milk", image: "/attached_assets/Ayran_1751636215832.jpg", sortOrder: 1 },
      { id: 5, name: "Churchill", description: "Özel Churchill", price: "15.00", categoryId: 2, iconName: "GlassWater", image: "/attached_assets/Churchill_1751636215833.jpg", sortOrder: 2 },
      
      // Tostlar
      { id: 6, name: "Çift Kaşarlı Tost", description: "Çift kaşarlı tost", price: "35.00", categoryId: 3, iconName: "Sandwich", image: "/attached_assets/Çift Kaşarlı Tost_1751636215833.webp", sortOrder: 1 },
      { id: 7, name: "Akdeniz Tost", description: "Akdeniz usulü tost", price: "40.00", categoryId: 3, iconName: "Sandwich", image: "/attached_assets/Akdeniz Tost_1751636215831.jpeg", sortOrder: 2 },
      
      // Sandviçler
      { id: 8, name: "Beyaz Peynirli", description: "Beyaz peynirli sandviç", price: "28.00", categoryId: 4, iconName: "Sandwich", image: "/attached_assets/Beyaz Peynirli_1751636215832.jpg", sortOrder: 1 },
      { id: 9, name: "Akdeniz Sandviç", description: "Akdeniz sandviç", price: "45.00", categoryId: 4, iconName: "Sandwich", image: "/attached_assets/Akdeniz Sandvih_1751636215831.jpg", sortOrder: 2 },
      
      // Salatalar
      { id: 10, name: "Çoban Salata", description: "Taze çoban salata", price: "25.00", categoryId: 5, iconName: "Salad", image: "/attached_assets/Çoban Salata_1751636215833.jpg", sortOrder: 1 },
    ];

    items.forEach(item => {
      this.items.set(item.id, item);
      this.currentItemId = Math.max(this.currentItemId, item.id + 1);
    });
  }

  async getMenuCategories(): Promise<MenuCategory[]> {
    return Array.from(this.categories.values()).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]> {
    return Array.from(this.items.values())
      .filter(item => item.categoryId === categoryId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async getAllMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.items.values()).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async createMenuCategory(insertCategory: InsertMenuCategory): Promise<MenuCategory> {
    const id = this.currentCategoryId++;
    const category: MenuCategory = { 
      ...insertCategory, 
      id,
      nameEn: insertCategory.nameEn || null,
      color: insertCategory.color || null,
      image: insertCategory.image || null
    };
    this.categories.set(id, category);
    return category;
  }

  async createMenuItem(insertItem: InsertMenuItem): Promise<MenuItem> {
    const id = this.currentItemId++;
    const item: MenuItem = { 
      ...insertItem, 
      id,
      iconName: insertItem.iconName || null,
      image: insertItem.image || null,
      description: insertItem.description || null
    };
    this.items.set(id, item);
    return item;
  }

  async updateMenuCategory(id: number, updateCategory: Partial<InsertMenuCategory>): Promise<MenuCategory> {
    const existingCategory = this.categories.get(id);
    if (!existingCategory) {
      throw new Error(`Category with id ${id} not found`);
    }
    const updatedCategory = { ...existingCategory, ...updateCategory };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async updateMenuItem(id: number, updateItem: Partial<InsertMenuItem>): Promise<MenuItem> {
    const existingItem = this.items.get(id);
    if (!existingItem) {
      throw new Error(`Item with id ${id} not found`);
    }
    const updatedItem = { ...existingItem, ...updateItem };
    this.items.set(id, updatedItem);
    return updatedItem;
  }

  async deleteMenuCategory(id: number): Promise<void> {
    this.categories.delete(id);
  }

  async deleteMenuItem(id: number): Promise<void> {
    this.items.delete(id);
  }
}

// Use in-memory storage for development, database storage for production
export const storage = process.env.NODE_ENV === 'production' 
  ? new DatabaseStorage() 
  : new MemStorage();
