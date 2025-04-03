import { NextResponse } from "next/server";
import { getDoctors } from "@/services";

export async function GET() {
    try {
        const doctors = await getDoctors();
        return NextResponse.json(doctors);
    } catch (error) {
        console.error("Erreur lors de la récupération des medecins:", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération des medecins" },
            { status: 500 }
        );
    }
}
