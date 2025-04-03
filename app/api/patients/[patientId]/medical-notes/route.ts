import { NextResponse } from "next/server";
import { getPatientNotes } from "@/services";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ patientId: string }> }
) {
    try {
        const notes = await getPatientNotes((await params).patientId);
        return NextResponse.json(notes, { status: 200 });
    } catch (error) {
        console.error("Error retrieving medical notes:", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération des notes médicales" },
            { status: 500 }
        );
    }
}
