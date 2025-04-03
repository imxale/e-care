import { NextRequest, NextResponse } from "next/server";
import { getDoctorAppointments } from "@/services";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ doctorId: string }> }
) {
    try {
        const appointments = await getDoctorAppointments((await params).doctorId);
        return NextResponse.json(appointments);
    } catch (error) {
        console.error("Erreur lors de la récupération des rendez-vous:", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération des rendez-vous" },
            { status: 500 }
        );
    }
}
