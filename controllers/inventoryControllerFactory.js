import { supabase } from "../config/supabaseClient.js";

const toApiItem = (row) => ({
  _id: String(row.id),
  id: String(row.id),
  name: row.name,
  quantity: row.quantity,
  pendingQuantity: row.pending_quantity,
  type: row.type,
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const toDbId = (id) => {
  const numericId = Number(id);
  if (!Number.isNaN(numericId) && String(numericId) === String(id)) {
    return numericId;
  }
  return id;
};

const readQuantity = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const createInventoryController = (tableName) => {
  const addItem = async (req, res) => {
    try {
      const { name, quantity, type } = req.body;

      const { data, error } = await supabase
        .from(tableName)
        .insert({
          name,
          type,
          quantity: 0,
          pending_quantity: readQuantity(quantity),
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;

      res.status(201).json(toApiItem(data));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const updateItemQuantity = async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      const itemId = toDbId(id);

      const { data: item, error: findError } = await supabase
        .from(tableName)
        .select("*")
        .eq("id", itemId)
        .single();

      if (findError) {
        if (findError.code === "PGRST116") {
          return res.status(404).json({ message: "Item not found" });
        }
        throw findError;
      }

      const { data, error } = await supabase
        .from(tableName)
        .update({
          pending_quantity: item.pending_quantity + readQuantity(quantity),
          status: "pending",
        })
        .eq("id", itemId)
        .select()
        .single();

      if (error) throw error;

      res.json(toApiItem(data));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const reduceItemQuantity = async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const reduceBy = readQuantity(quantity);
      const itemId = toDbId(id);

      const { data: item, error: findError } = await supabase
        .from(tableName)
        .select("*")
        .eq("id", itemId)
        .single();

      if (findError) {
        if (findError.code === "PGRST116") {
          return res.status(404).json({ message: "Item not found" });
        }
        throw findError;
      }

      if (reduceBy > item.quantity) {
        return res
          .status(400)
          .json({ message: "Quantity to reduce exceeds current stock" });
      }

      const { data, error } = await supabase
        .from(tableName)
        .update({
          quantity: item.quantity - reduceBy,
        })
        .eq("id", itemId)
        .select()
        .single();

      if (error) throw error;

      res.json(toApiItem(data));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const getAllItems = async (req, res) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;

      res.json(data.map(toApiItem));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const processItem = async (req, res) => {
    try {
      const { id } = req.params;
      const itemId = toDbId(id);

      const { data: item, error: findError } = await supabase
        .from(tableName)
        .select("*")
        .eq("id", itemId)
        .single();

      if (findError) {
        if (findError.code === "PGRST116") {
          return res.status(404).json({ message: "Item not found" });
        }
        throw findError;
      }

      const { data, error } = await supabase
        .from(tableName)
        .update({
          quantity: item.quantity + item.pending_quantity,
          pending_quantity: 0,
          status: "processed",
        })
        .eq("id", itemId)
        .select()
        .single();

      if (error) throw error;

      res.json(toApiItem(data));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const getPendingItems = async (req, res) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .eq("status", "pending")
        .order("updated_at", { ascending: false });

      if (error) throw error;

      res.json(data.map(toApiItem));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const getProcessedItems = async (req, res) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .eq("status", "processed")
        .order("updated_at", { ascending: false });

      if (error) throw error;

      res.json(data.map(toApiItem));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  return {
    addItem,
    updateItemQuantity,
    reduceItemQuantity,
    getAllItems,
    processItem,
    getPendingItems,
    getProcessedItems,
  };
};
