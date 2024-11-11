const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const aiRoute = require("./controller/ai");
const authRoutes = require("./routes/auth");

dotenv.config();

const app = express();
const port = 3003;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO, {})
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("MongoDB connection error:", error));

app.use(aiRoute);
app.use(authRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
