import { prisma } from "@/lib/prisma";
import type { MedicalNote } from "@/services/types";

function convertDatesToString(note: any): MedicalNote {
    return {
        ...note,
        createdAt: note.createdAt.toISOString(),
        updatedAt: note.updatedAt.toISOString(),
    };
}

export async function getPatientMedicalNotes(
    patientId: string
): Promise<MedicalNote[]> {
    const notes = await prisma.medicalNote.findMany({
        where: {
            patientId: patientId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return notes.map(convertDatesToString);
}

export async function getDoctorPatientNotes(
    doctorId: string,
    patientId: string
): Promise<MedicalNote[]> {
    const notes = await prisma.medicalNote.findMany({
        where: {
            doctorId: doctorId,
            patientId: patientId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return notes.map(convertDatesToString);
}

export async function addMedicalNote(
    note: Omit<MedicalNote, "id" | "createdAt" | "updatedAt">
): Promise<MedicalNote> {
    const newNote = await prisma.medicalNote.create({
        data: note,
    });
    return convertDatesToString(newNote);
}
