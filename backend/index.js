const express = require("express");
const app = express();
const notesRoutes = require("./routes/notesRoutes");
const cors = require("cors");
require("dotenv").config();

const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("¡Hi, world!");
});

app.use("/", notesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
});
