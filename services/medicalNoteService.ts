import { supabase } from "./supabase";
import type { MedicalNote } from "./types";

export const getPatientMedicalNotes = async (
    doctorId: string,
    patientId: string
) => {
    const { data, error } = await supabase
        .from("medicalNote")
        .select("*")
        .eq("doctorId", doctorId)
        .eq("patientId", patientId)
        .order("createdAt", { ascending: false });

    if (error) throw error;
    return data as MedicalNote[];
};

export const addMedicalNote = async (
    note: Omit<MedicalNote, "id" | "createdAt" | "updatedAt">
) => {
    const { data, error } = await supabase
        .from("medicalNote")
        .insert([note])
        .select()
        .single();

    if (error) throw error;
    return data as MedicalNote;
};
