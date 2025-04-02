import { NextResponse } from "next/server";
import { updateAppointmentStatus } from "@/services";

export async function PATCH(
    request: Request,
    { params }: { params: { appointmentId: string } }
) {
    try {
        const { statusId } = await request.json();
        const userType = request.headers.get("x-user-type") as
            | "patient"
            | "medecin";
        if (!userType) {
            return NextResponse.json(
                { error: "Type d'utilisateur manquant" },
                { status: 400 }
            );
        }
        const appointment = await updateAppointmentStatus(
            params.appointmentId,
            statusId,
            userType
        );
        return NextResponse.json(appointment);
    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut:", error);
        return NextResponse.json(
            { error: "Erreur lors de la mise à jour du statut" },
            { status: 500 }
        );
    }
}
