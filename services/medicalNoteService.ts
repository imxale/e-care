import { supabase } from "../lib/supabase";
import type { MedicalNote } from "./types";
import { v4 as uuidv4 } from "uuid";


export const getDoctorPatientNotes = async (
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

export const getPatientNotes = async (
    patientId: string
): Promise<MedicalNote[]> => {
    const { data, error } = await supabase
        .from("medicalNote")
        .select("*")
        .eq("patientId", patientId)
        .order("createdAt", { ascending: false });

    if (error) throw error;
    return data as MedicalNote[];
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
