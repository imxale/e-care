import { NextResponse } from "next/server";
import { getPatientAppointments } from "@/services";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ patientId: string }> }
) {
    try {
        const appointments = await getPatientAppointments((await params).patientId);
        return NextResponse.json(appointments);
    } catch (error) {
        console.error("Erreur lors de la récupération des rendez-vous:", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération des rendez-vous" },
            { status: 500 }
        );
    }
}
