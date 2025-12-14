import express from "express";
import {
  addItem,
  updateItemQuantity,
  getAllItems,
  reduceItemQuantity,
  processItem,
  getPendingItems, getProcessedItems
} from "../controllers/labelController.js";

const router = express.Router();

// Routes
router.post("/add", addItem);                  // Add new item
router.put("/update/:id", updateItemQuantity); // Update quantity by ID
router.get("/all", getAllItems);              // Get all items
router.put("/reduce/:id", reduceItemQuantity); // Reduce quantity by ID
router.patch("/process/:id", processItem);
router.get("/pending", getPendingItems);      // Get all pending items
router.get("/processed", getProcessedItems);  // Get all processed items

export default router;
