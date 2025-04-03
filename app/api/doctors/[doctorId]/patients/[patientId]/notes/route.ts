import {NextRequest, NextResponse} from "next/server";
import {
    getDoctorPatientNotes,
    addMedicalNote,
} from "@/services/medicalNoteService";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ doctorId: string; patientId: string }> }
) {
    const { doctorId, patientId } = await params;
    try {
        const notes = await getDoctorPatientNotes(
            doctorId,
            patientId
        );
        return NextResponse.json(notes);
    } catch (error) {
        console.error("Erreur lors de la récupération des notes:", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération des notes" },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ doctorId: string; patientId: string }> }
) {
    const { doctorId, patientId } = await params;
    try {
        const note = await request.json();
        const newNote = await addMedicalNote({
            ...note,
            doctorId,
            patientId,
        });
        return NextResponse.json(newNote);
    } catch (error) {
        console.error("Erreur lors de l'ajout de la note:", error);
        return NextResponse.json(
            { error: "Erreur lors de l'ajout de la note" },
            { status: 500 }
        );
    }
}
