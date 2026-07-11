
import { createInventoryController } from "./inventoryControllerFactory.js";
import { PACKING_MATERIALS_TABLE } from "../models/packingmaterialModel.js";

export const {
  addItem,
  updateItemQuantity,
  reduceItemQuantity,
  getAllItems,
  processItem,
  getPendingItems,
  getProcessedItems,
} = createInventoryController(PACKING_MATERIALS_TABLE);
