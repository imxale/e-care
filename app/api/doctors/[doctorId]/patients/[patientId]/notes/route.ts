import { NextResponse } from "next/server";
import {
    getDoctorPatientNotes,
    addMedicalNote,
} from "@/services/medicalNoteService";

export async function GET(
    request: Request,
    { params }: { params: { doctorId: string; patientId: string } }
) {
    try {
        const notes = await getDoctorPatientNotes(
            params.doctorId,
            params.patientId
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
    request: Request,
    { params }: { params: { doctorId: string; patientId: string } }
) {
    try {
        const note = await request.json();
        const newNote = await addMedicalNote({
            ...note,
            doctorId: params.doctorId,
            patientId: params.patientId,
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
