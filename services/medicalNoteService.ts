import { supabase } from "../lib/supabase";
import type { MedicalNote } from "./types";
import { v4 as uuidv4 } from "uuid";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const getPatientMedicalNotes = async (
    doctorId: string,
    patientId: string
): Promise<MedicalNote[]> => {
    const { data, error } = await supabase
        .from("medicalNote")
        .select("*")
        .eq("doctorId", doctorId)
        .eq("patientId", patientId)
        .order("createdAt", { ascending: false });

    if (error) throw error;
    return data as MedicalNote[];
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
): Promise<MedicalNote> => {
    const { data, error } = await supabase
        .from("medicalNote")
        .insert({
            id: uuidv4(),
            ...note,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        })
        .select()
        .single();

    if (error) throw error;
    return data as MedicalNote;
};
