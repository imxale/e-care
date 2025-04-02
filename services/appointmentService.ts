import type { Appointment } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const createAppointment = async (
    doctorId: string,
    patientId: string,
    start: Date,
    end: Date,
    reason: string
) => {
    try {
        const response = await fetch(`${API_URL}/api/appointments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                doctorId,
                patientId,
                start: start.toISOString(),
                end: end.toISOString(),
                reason,
            }),
        });
        if (!response.ok) {
            throw new Error("Erreur lors de la création du rendez-vous");
        }
        return await response.json();
    } catch (error) {
        console.error("Erreur:", error);
        throw error;
    }
};

export const getPatientAppointments = async (patientId: string) => {
    try {
        const response = await fetch(
            `${API_URL}/api/patients/${patientId}/appointments`
        );
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des rendez-vous");
        }
        return await response.json();
    } catch (error) {
        console.error("Erreur:", error);
        throw error;
    }
};

export const getDoctorAppointments = async (doctorId: string) => {
    try {
        const response = await fetch(
            `${API_URL}/api/doctors/${doctorId}/appointments`
        );
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des rendez-vous");
        }
        return await response.json();
    } catch (error) {
        console.error("Erreur:", error);
        throw error;
    }
};

export const updateAppointmentStatus = async (
    appointmentId: string,
    statusId: string
) => {
    try {
        const response = await fetch(
            `${API_URL}/api/appointments/${appointmentId}/status`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ statusId }),
            }
        );
        if (!response.ok) {
            throw new Error("Erreur lors de la mise à jour du statut");
        }
        return await response.json();
    } catch (error) {
        console.error("Erreur:", error);
        throw error;
    }
};
