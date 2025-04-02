import { NextResponse } from "next/server";
import { getPatientAppointments } from "@/app/api/services";

export async function GET(
    request: Request,
    context: { params: { patientId: string } }
) {
    const patientId = context.params.patientId;

    try {
        const appointments = await getPatientAppointments(patientId);
        return NextResponse.json(appointments);
    } catch (error) {
        console.error("Erreur lors de la récupération des rendez-vous:", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération des rendez-vous" },
            { status: 500 }
        );
    }
}
