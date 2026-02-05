import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function checkTask() {
    const taskId = "818cc638-77fc-48ba-87b9-9c129ad067da";
    const loggedInUserId = "33c514ae-b0bb-41e4-812b-659c411a74da";

    try {
        const task = await prisma.task.findUnique({
            where: { id: taskId }
        });

        if (!task) {
            console.log("Task not found in DB.");
            return;
        }

        console.log("TASK DETAILS:");
        console.log("ID:", task.id);
        console.log("AssignedTo:", task.assignedTo);
        console.log("Status:", task.status);

        if (task.assignedTo === loggedInUserId) {
            console.log("MATCH: The user IS assigned to this task.");
        } else {
            console.log("MISMATCH: The user IS NOT assigned to this task!");
            console.log(`Task belongs to: ${task.assignedTo}`);
            console.log(`Action attempted by: ${loggedInUserId}`);
        }

    } catch (e) {
        console.error("Error checking task:", e);
    } finally {
        await prisma.$disconnect();
    }
}

checkTask();
