import { supabase } from "../lib/supabase";
import type { User } from "./types";

export const getDoctorPatients = async (doctorId: string): Promise<User[]> => {
    const { data, error } = await supabase
        .from("user")
        .select("*")
        .eq("doctorId", doctorId)
        .eq("role", "patient");

    if (error) {
        console.error("Erreur Supabase:", error);
        throw new Error("Erreur lors de la récupération des patients");
    }

    console.log("Patients trouvés:", data);
    return data as User[];
};
