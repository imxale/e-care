import { NextResponse } from "next/server";
import { createAppointment } from "@/services";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { doctorId, patientId, start, end, reason, locationTypeId, appointmentTypeId } = body;

        const appointment = await createAppointment(
            doctorId,
            patientId,
            new Date(start),
            new Date(end),
            reason,
            locationTypeId,
            appointmentTypeId
        );

        return NextResponse.json(appointment);
    } catch (error) {
        console.error("Erreur lors de la création du rendez-vous:", error);
        return NextResponse.json(
            { error: "Erreur lors de la création du rendez-vous" },
            { status: 500 }
        );
    }
}
