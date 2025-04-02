import { supabase } from "./supabase";
import type { User } from "./types";

export const getDoctorPatients = async (doctorId: string) => {
    const { data, error } = await supabase
        .from("user")
        .select("*")
        .eq("doctorId", doctorId);

    if (error) {
        console.error("Erreur Supabase:", error);
        throw error;
    }

    console.log("Données reçues de Supabase:", data);
    return data as User[];
};
