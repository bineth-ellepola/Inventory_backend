
import { createInventoryController } from "./inventoryControllerFactory.js";
import { LABELS_TABLE } from "../models/labelModel.js";

export const {
  addItem,
  updateItemQuantity,
  reduceItemQuantity,
  getAllItems,
  processItem,
  getPendingItems,
  getProcessedItems,
} = createInventoryController(LABELS_TABLE);
