import type { MedicalNote } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const getPatientMedicalNotes = async (patientId: string) => {
    try {
        const response = await fetch(
            `${API_URL}/api/patients/${patientId}/medical-notes`
        );
        if (!response.ok) {
            throw new Error(
                "Erreur lors de la récupération des notes médicales"
            );
        }
        return await response.json();
    } catch (error) {
        console.error("Erreur:", error);
        throw error;
    }
};

export const getDoctorPatientNotes = async (
    doctorId: string,
    patientId: string
) => {
    try {
        const response = await fetch(
            `${API_URL}/api/doctors/${doctorId}/patients/${patientId}/medical-notes`
        );
        if (!response.ok) {
            throw new Error(
                "Erreur lors de la récupération des notes médicales"
            );
        }
        return await response.json();
    } catch (error) {
        console.error("Erreur:", error);
        throw error;
    }
};

export const addMedicalNote = async (
    note: Omit<MedicalNote, "id" | "createdAt" | "updatedAt">
) => {
    try {
        const response = await fetch(`${API_URL}/api/medical-notes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(note),
        });
        if (!response.ok) {
            throw new Error("Erreur lors de l'ajout de la note médicale");
        }
        return await response.json();
    } catch (error) {
        console.error("Erreur:", error);
        throw error;
    }
};
