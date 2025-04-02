import { supabase } from "../lib/supabase";
import type {
    Appointment,
    AppointmentType,
    AppointmentStatus,
    LocationType,
    User,
} from "./types";
import { v4 as uuidv4 } from "uuid";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const getAppointmentTypes = async () => {
    const { data, error } = await supabase
        .from("appointmentType")
        .select("*")
        .order("name");

    if (error) throw error;
    return data as AppointmentType[];
};

export const getAppointmentStatuses = async () => {
    const { data, error } = await supabase
        .from("appointmentStatus")
        .select("*")
        .order("name");

    if (error) throw error;
    return data as AppointmentStatus[];
};

export const getLocationTypes = async () => {
    const { data, error } = await supabase
        .from("locationType")
        .select("*")
        .order("name");

    if (error) throw error;
    return data as LocationType[];
};

export const createAppointment = async (
    doctorId: string,
    patientId: string,
    start: Date,
    end: Date,
    reason: string,
    locationTypeId: string,
    appointmentTypeId: string
): Promise<Appointment> => {
    // Récupérer l'ID du statut "En attente"
    const { data: statusData, error: statusError } = await supabase
        .from("appointmentStatus")
        .select("id")
        .eq("name", "En attente")
        .limit(1);

    if (statusError) throw statusError;
    if (!statusData || statusData.length === 0) {
        throw new Error("Statut 'En attente' non trouvé");
    }

    const { data, error } = await supabase
        .from("appointment")
        .insert({
            id: uuidv4(),
            doctorId,
            patientId,
            start: start.toISOString(),
            end: end.toISOString(),
            reason,
            locationTypeId,
            typeId: appointmentTypeId,
            statusId: statusData[0].id,
            takedAt: new Date().toISOString(),
        })
        .select()
        .single();

    if (error) throw error;
    return data as Appointment;
};

export async function getPatientAppointments(
    patientId: string
): Promise<Appointment[]> {
    const { data, error } = await supabase
        .from("appointment")
        .select(
            `
            *,
            type:appointmentType(*),
            status:appointmentStatus(*),
            locationType:locationType(*),
            doctor:doctorId(*)
        `
        )
        .eq("patientId", patientId)
        .order("start", { ascending: false });

    if (error) throw error;
    return data || [];
}

export const getDoctorAppointments = async (doctorId: string) => {
    const { data, error } = await supabase
        .from("appointment")
        .select(
            `
            *,
            type:appointmentType(*),
            status:appointmentStatus(*),
            locationType:locationType(*),
            patient:patientId(*)
        `
        )
        .eq("doctorId", doctorId)
        .order("start", { ascending: false });

    if (error) throw error;
    return data as Appointment[];
};

export const updateAppointmentStatus = async (
    appointmentId: string,
    statusId: string
) => {
    const { data, error } = await supabase
        .from("appointment")
        .update({ statusId })
        .eq("id", appointmentId)
        .select()
        .single();

    if (error) throw error;
    return data as Appointment;
};

export const getDoctors = async () => {
    const { data, error } = await supabase
        .from("user")
        .select("*")
        .eq("role", "medecin");

    if (error) throw error;
    return data as User[];
};
