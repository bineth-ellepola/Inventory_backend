import express from "express";
import {
  addItem,
  updateItemQuantity,
  getAllItems,
  reduceItemQuantity,
  getPendingItems,
  getProcessedItems,
  processItem           // ✅ import from PackingMaterial controller
} from "../controllers/packingmaterialController.js";

const router = express.Router();

// Routes
router.post("/add", addItem);                    // Add new item
router.put("/update/:id", updateItemQuantity);  // Update pending quantity by ID
router.get("/all", getAllItems);                // Get all items
router.put("/reduce/:id", reduceItemQuantity);  // Reduce quantity by ID
router.patch("/process/:id", processItem);      // Move pending to actual
router.get("/pending", getPendingItems);        // Get all pending items
router.get("/processed", getProcessedItems);    // Get all processed items

export default router;
