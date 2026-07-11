
import { createInventoryController } from "./inventoryControllerFactory.js";
import { CHEMICALS_TABLE } from "../models/chemicalModel.js";

export const {
  addItem,
  updateItemQuantity,
  reduceItemQuantity,
  getAllItems,
  processItem,
  getPendingItems,
  getProcessedItems,
} = createInventoryController(CHEMICALS_TABLE);