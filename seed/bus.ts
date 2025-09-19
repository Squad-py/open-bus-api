// model Route {
//   id Int @id @default(autoincrement())
//   name String
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
//   buses Bus[]
// }

// model Bus {
//   id Int @id
//   routeId Int
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
//   Route Route @relation(fields: [routeId], references: [id])
//   reports Report[]
//   transfers Transfer[]
// }

import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

async function addBuses() {
    try {
        await prisma.route.createMany({
            data: {
                id: 1,
                name: 'Route 50'
            }
        })

        await prisma.bus.createMany({
            data: [
                {
                    id: 1111,
                    routeId: 1
                },
            ]
        });
    }
    catch (error) {
        console.error("Error adding buses:", error);
    }
}

addBuses()
