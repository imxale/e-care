import { NextResponse } from "next/server";
import { getDoctorAppointments } from "@/services";

export async function GET(
    request: Request,
    { params }: { params: { doctorId: string } }
) {
    try {
        const appointments = await getDoctorAppointments(params.doctorId);
        return NextResponse.json(appointments);
    } catch (error) {
        console.error("Erreur lors de la récupération des rendez-vous:", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération des rendez-vous" },
            { status: 500 }
        );
    }
}
