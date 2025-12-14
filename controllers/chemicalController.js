
import Chemical from "../models/chemicalModel.js";

// Add new item
export const addItem = async (req, res) => {
  try {
    const { name, quantity, type } = req.body;

    const newItem = new Chemical({
       name,
      type,
      quantity: 0,               // actual qty stays 0
      pendingQuantity: quantity, // added qty waits in pending
      status: "pending"
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update item quantity (add to existing quantity)
export const updateItemQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const item = await Chemical.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.pendingQuantity += quantity; // add to pending
    item.status = "pending";

    const updatedItem = await item.save();
    res.json(updatedItem);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Reduce item quantity (subtract from existing quantity)
export const reduceItemQuantity = async (req, res) => {
  try {
    const { id } = req.params; // Item ID
    const { quantity } = req.body; // Quantity to reduce

    const item = await Chemical.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (quantity > item.quantity) {
      return res.status(400).json({ message: "Quantity to reduce exceeds current stock" });
    }

    // Subtract the quantity
    item.quantity -= quantity;

    const updatedItem = await item.save(); // updatedAt updates automatically
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all items
export const getAllItems = async (req, res) => {
  try {
    const items = await Chemical.find().sort({ updatedAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const processItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Chemical.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // move pending to actual
    item.quantity += item.pendingQuantity;
    item.pendingQuantity = 0;
    item.status = "processed";

    const updatedItem = await item.save();
    res.json(updatedItem);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get all pending items
export const getPendingItems = async (req, res) => {
  try {
    const items = await Chemical.find({ status: "pending" }).sort({ updatedAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get all processed items
export const getProcessedItems = async (req, res) => {
  try {
    const items = await Chemical.find({ status: "processed" }).sort({ updatedAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};