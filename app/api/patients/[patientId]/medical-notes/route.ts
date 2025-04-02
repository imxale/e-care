import { NextResponse } from "next/server";
import { getPatientMedicalNotes } from "@/app/api/services";

export async function GET(
    request: Request,
    context: { params: { patientId: string } }
) {
    const patientId = context.params.patientId;

    try {
        const notes = await getPatientMedicalNotes(patientId);
        return NextResponse.json(notes);
    } catch (error) {
        console.error(
            "Erreur lors de la récupération des notes médicales:",
            error
        );
        return NextResponse.json(
            { error: "Erreur lors de la récupération des notes médicales" },
            { status: 500 }
        );
    }
}
