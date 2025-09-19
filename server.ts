import express from "express";
import cors from "cors";
import dotenv from "dotenv"

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Welcome to the Open Bus API");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
