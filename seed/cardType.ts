import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

async function addCardTypes() {
    try {
        await prisma.cardType.createMany({
            data: [
                {
                    id: 1,
                    name: 'Common card type',
                    description: 'A standard card type with basic features.'
                },
                {
                    id: 2,
                    name: 'Preferential card type',
                    description: 'A card type that offers preferential costs.'
                }
            ]
        });
    } catch (error) {
        console.error("Error adding card types:", error);
    }
}

addCardTypes()
