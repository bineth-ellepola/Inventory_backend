import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import labelRoutes from "./routes/labelRoute.js";
import chemicalRoutes from "./routes/chemicalRoute.js";
import packingmaterialRoutes from "./routes/packingmaterialRoute.js";

dotenv.config();

const app = express();
/* ---------- MIDDLEWARE ---------- */
app.use(cors({
  origin: "*", // later you can restrict to Netlify URL
}));
app.use(express.json());

// Routes
app.use("/api/labels", labelRoutes);
app.use("/api/chemicals", chemicalRoutes);
app.use("/api/packingmaterials", packingmaterialRoutes);

// Root test route
app.get("/", (req, res) => {
  res.send("Inventory API is running 🚀");
});

// Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
