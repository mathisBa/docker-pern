import express from "express";
import dotenv from "dotenv";
import visitsRouter from "./routes/visits";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

// Exemple de route
app.get("/", (_req, res) => {
  res.send("Hello from Express + TypeScript!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use("/visits", visitsRouter);
