import { prisma } from "@/lib/prisma";
import type { User } from "@/services/types";

export async function getDoctorPatients(doctorId: string): Promise<User[]> {
    return prisma.user.findMany({
        where: {
            doctorId: doctorId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}
