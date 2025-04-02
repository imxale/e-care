import { supabase } from "./supabase";
import type { Appointment } from "./types";

export const getDoctorAppointments = async (doctorId: string) => {
    const { data, error } = await supabase
        .from("appointment")
        .select(
            `
            *,
            appointmentType:appointmentType(*),
            appointmentStatus:appointmentStatus(*),
            locationType:locationType(*),
            patient:user!patientId(*)
        `
        )
        .eq("doctorId", doctorId)
        .order("start", { ascending: true });

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
