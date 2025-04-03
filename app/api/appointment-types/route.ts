import { NextResponse } from "next/server";
import { getAppointmentTypes } from "@/services";

export async function GET() {
    try {
        const appointmentTypes = await getAppointmentTypes();
        return NextResponse.json(appointmentTypes);
    } catch (error) {
        console.error("Erreur lors de la récupération des types :", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération des types" },
            { status: 500 }
        );
    }
}
