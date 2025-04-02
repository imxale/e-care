import { NextResponse } from "next/server";
import { updateAppointmentStatus } from "@/app/api/services";

export async function PATCH(
    request: Request,
    { params }: { params: { appointmentId: string } }
) {
    try {
        const { statusId } = await request.json();
        const appointment = await updateAppointmentStatus(
            params.appointmentId,
            statusId
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
