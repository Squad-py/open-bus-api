import express from "express";
import cors from "cors";
import dotenv from "dotenv"

import { PrismaClient } from "./generated/prisma/index.js";
const prisma = new PrismaClient();

const app = express();
dotenv.config();

app.use(cors({
    origin: "*"
}));
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Open Bus API" });
});

app.post("/card/recharge", async (req, res) => {
    try {
        const cardId = Number(req.body.cardId);
        const amount = Number(req.body.amount);

        await prisma.card.update({
            where: { id: cardId },
            data: { balance: { increment: amount } }
        });

        await prisma.transaction.create({
            data: {
                cardId,
                amount
            }
        });

        res.status(200).json({ message: `Card ${cardId} recharged successfully.` });

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
