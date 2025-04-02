import type { User } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const getDoctorPatients = async (doctorId: string) => {
    try {
        const response = await fetch(
            `${API_URL}/api/doctors/${doctorId}/patients`
        );
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des patients");
        }
        const patients = await response.json();
        console.log("Données reçues de l'API:", patients);
        return patients as User[];
    } catch (error) {
        console.error("Erreur:", error);
        throw error;
    }
};
