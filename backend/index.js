require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const tasks = require("./routes/tasks");
const journals = require("./routes/journals");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", tasks);
app.use("/api/journals", journals);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
