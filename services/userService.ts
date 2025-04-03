import { supabase } from "../lib/supabase";
import type { User } from "./types";

export const createUser = async (
  userId: string,
  firstName: string,
  lastName: string,
  role: string = "patient"
): Promise<User> => {
  // Vérification des données
  if (!userId || !firstName || !lastName) {
    throw new Error("Les champs userId, firstName et lastName sont obligatoires");
  }

  // Vérifier si l'utilisateur existe déjà
  const { data: existingUser, error: findError } = await supabase
    .from("user")
    .select("id")
    .eq("id", userId)
    .single();

  if (findError && findError.code !== "PGRST116") {
    // PGRST116 = Not Found, les autres erreurs sont problématiques
    throw findError;
  }

  if (existingUser) {
    throw new Error("Cet utilisateur existe déjà dans la base de données");
  }

  // Créer l'utilisateur
  const { data, error } = await supabase
    .from("user")
    .insert({
      id: userId,
      firstName,
      lastName,
      role
    })
    .select()
    .single();

  if (error) throw error;
  return data as User;
};

export const getUserById = async (userId: string): Promise<User | null> => {
  if (!userId) {
    throw new Error("L'ID utilisateur est obligatoire");
  }

  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Utilisateur non trouvé
      return null;
    }
    throw error;
  }

  return data as User;
};

export const getUsersByRole = async (role: string): Promise<User[]> => {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("role", role);

  if (error) throw error;
  return data as User[];
};

export const updateUser = async (
  userId: string,
  updateData: Partial<User>
): Promise<User> => {
  const { data, error } = await supabase
    .from("user")
    .update(updateData)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data as User;
};

export const setPatientDoctor = async (
  patientId: string,
  doctorId: string
): Promise<User> => {
  // Vérifier si le patient existe
  const { error: patientError } = await supabase
    .from("user")
    .select("*")
    .eq("id", patientId)
    .eq("role", "patient")
    .single();

  if (patientError) {
    if (patientError.code === "PGRST116") {
      throw new Error("Patient non trouvé");
    }
    throw patientError;
  }

  // Vérifier si le médecin existe
  const { error: doctorError } = await supabase
    .from("user")
    .select("*")
    .eq("id", doctorId)
    .eq("role", "medecin")
    .single();

  if (doctorError) {
    if (doctorError.code === "PGRST116") {
      throw new Error("Médecin non trouvé");
    }
    throw doctorError;
  }

  // Mettre à jour le doctorId du patient
  const { data, error } = await supabase
    .from("user")
    .update({ doctorId })
    .eq("id", patientId)
    .select()
    .single();

  if (error) throw error;
  return data as User;
};

export const getPatientDoctor = async (patientId: string): Promise<User | null> => {
  if (!patientId) {
    throw new Error("L'ID du patient est obligatoire");
  }

  // Récupérer le patient avec son doctorId
  const { data: patient, error: patientError } = await supabase
    .from("user")
    .select("doctorId")
    .eq("id", patientId)
    .single();

  if (patientError) {
    if (patientError.code === "PGRST116") {
      return null;
    }
    throw patientError;
  }

  if (!patient.doctorId) {
    return null;
  }

  // Récupérer les informations du médecin
  const { data: doctor, error: doctorError } = await supabase
    .from("user")
    .select("*")
    .eq("id", patient.doctorId)
    .single();

  if (doctorError) {
    if (doctorError.code === "PGRST116") {
      return null;
    }
    throw doctorError;
  }

  return doctor as User;
}; 