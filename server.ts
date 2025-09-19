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

app.patch("/card/using", async (req, res) => {
    try {
        const { serialNumber, location } = req.body;
        const busId = Number(req.body.busId);

        const card = await prisma.card.findUnique({
            where: { serialNumber },
            select: { id: true, isPreferential: true }
        });

        if (!card) {
            return res.status(404).json({ error: "Card not found" });
        }

        await prisma.card.update({
            where: { serialNumber },
            data: { balance: { decrement: card.isPreferential ? 5.25 : 11.00 } }
        });


        const transfer = await prisma.transfer.create({
            data: {
                cardId: card.id,
                busId,
                location
            },
            select: { id: true }
        })

        const transferId = transfer.id;

        await prisma.transaction.create({
            data: {
                cardId: card.id,
                amount: card.isPreferential ? -5.25 : -11.00,
                transferId
            }
        });

        res.status(200).json({ message: `Card ${serialNumber} used successfully.` });

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
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

app.get("/card/:cardId", async (req, res) => {
    try {
        const cardId = Number(req.params.cardId);

        const cardBalance = await prisma.card.findUnique({
            where: { id: cardId },
            select: { balance: true, serialNumber: true, isPreferential: true }
        })

        const cardUses = await prisma.transaction.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            where: {
                cardId,
            },
            select: {
                amount: true,
                createdAt: true,
                Transfer: {
                    select: {
                        Bus: {
                            select: {
                                id: true,
                                Route: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            take: 10,
        });

        res.status(200).json({ cardBalance, cardUses });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
