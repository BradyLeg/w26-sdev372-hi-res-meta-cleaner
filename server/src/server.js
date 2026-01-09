import cors from "cors";
import express from "express";
import sequelize, { connectDB } from "./db/sequelize.js";
import "./models/index.js";
import apiRouter from "./routes/routes.js";

// Initialize Express application
const app = express();

// Enable Cross-Origin Resource Sharing (CORS) for all routes
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// Mount the API router at the root path
app.use("/", apiRouter);

// Define the port number for the server
const PORT = 3000;

// Connect to DB
await connectDB();

// sync models and DB tables - DEV ONLY remove for production
if (process.env.NODE_ENV === "development") {
  await sequelize.sync({ alter: true });
}

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
