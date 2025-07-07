import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMenuCategorySchema, insertMenuItemSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Sadece resim dosyaları yüklenebilir (JPG, PNG, GIF, WebP)'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded images
  app.use('/uploads', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    next();
  });
  app.use('/uploads', express.static(uploadsDir));

  // Health check endpoint for uptime monitoring
  app.get("/health", (req, res) => {
    res.status(200).json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      service: "datca-cafe"
    });
  });

  // Get all menu categories
  app.get("/api/menu/categories", async (req, res) => {
    try {
      const categories = await storage.getMenuCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch menu categories" });
    }
  });

  // Get menu items by category
  app.get("/api/menu/categories/:categoryId/items", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      if (isNaN(categoryId)) {
        return res.status(400).json({ error: "Invalid category ID" });
      }
      
      const items = await storage.getMenuItemsByCategory(categoryId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch menu items" });
    }
  });

  // Get all menu items
  app.get("/api/menu/items", async (req, res) => {
    try {
      const items = await storage.getAllMenuItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch menu items" });
    }
  });

  // Image upload endpoint
  app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Resim dosyası bulunamadı' });
      }
      
      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({ 
        success: true, 
        imageUrl,
        originalName: req.file.originalname,
        size: req.file.size
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Resim yüklenirken bir hata oluştu' });
    }
  });

  // Admin Routes
  app.post('/api/admin/categories', async (req, res) => {
    try {
      const result = insertMenuCategorySchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid category data', details: result.error.issues });
      }
      const category = await storage.createMenuCategory(result.data);
      res.json(category);
    } catch (error) {
      console.error('Error creating category:', error);
      res.status(500).json({ error: 'Failed to create category' });
    }
  });

  app.put('/api/admin/categories/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = insertMenuCategorySchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid category data', details: result.error.issues });
      }
      const category = await storage.updateMenuCategory(id, result.data);
      res.json(category);
    } catch (error) {
      console.error('Error updating category:', error);
      res.status(500).json({ error: 'Failed to update category' });
    }
  });

  app.delete('/api/admin/categories/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteMenuCategory(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ error: 'Failed to delete category' });
    }
  });

  app.post('/api/admin/items', async (req, res) => {
    try {
      const result = insertMenuItemSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid item data', details: result.error.issues });
      }
      const item = await storage.createMenuItem(result.data);
      res.json(item);
    } catch (error) {
      console.error('Error creating item:', error);
      res.status(500).json({ error: 'Failed to create item' });
    }
  });

  app.put('/api/admin/items/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const result = insertMenuItemSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: 'Invalid item data', details: result.error.issues });
      }
      const item = await storage.updateMenuItem(id, result.data);
      res.json(item);
    } catch (error) {
      console.error('Error updating item:', error);
      res.status(500).json({ error: 'Failed to update item' });
    }
  });

  app.delete('/api/admin/items/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteMenuItem(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting item:', error);
      res.status(500).json({ error: 'Failed to delete item' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
