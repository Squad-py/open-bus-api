import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

async function addCards() {
    try {
        await prisma.card.createMany({
            data: [
                {
                    id: 12345678,
                    serialNumber: 'E9 6F F9 B1',
                    cardTypeId: 1,
                    isPreferential: false,
                    balance: 0.00
                },
                {
                    id: 10044478,
                    serialNumber: '04 527F E2 34 1D 90',
                    cardTypeId: 2,
                    isPreferential: true,
                    balance: 0.00
                },
                {
                    id: 5232373,
                    serialNumber: '04 1D 53 92 AF 1D 90',
                    cardTypeId: 2,
                    isPreferential: true,
                    balance: 0.00
                }

            ]
        });
    } catch (error) {
        console.error("Error adding cards:", error);
    }
}

addCards()
