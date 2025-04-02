import { prisma } from "@/lib/prisma";
import type { Appointment } from "@/services/types";

function convertDatesToString(appointment: any): Appointment {
    return {
        ...appointment,
        start: appointment.start.toISOString(),
        end: appointment.end.toISOString(),
        takedAt: appointment.takedAt.toISOString(),
        createdAt: appointment.createdAt.toISOString(),
        updatedAt: appointment.updatedAt.toISOString(),
    };
}

export async function createAppointment(
    doctorId: string,
    patientId: string,
    start: Date,
    end: Date,
    reason: string
): Promise<Appointment> {
    const appointment = await prisma.appointment.create({
        data: {
            doctorId,
            patientId,
            start,
            end,
            takedAt: new Date(),
            reason,
            statusId: "status123", // Confirmed
            typeId: "type123", // Consultation standard
            locationTypeId: "location123", // Cabinet
        },
        include: {
            type: true,
            status: true,
            locationType: true,
            patient: true,
        },
    });
    return convertDatesToString(appointment);
}

export async function getPatientAppointments(
    patientId: string
): Promise<Appointment[]> {
    const appointments = await prisma.appointment.findMany({
        where: {
            patientId: patientId,
        },
        include: {
            type: true,
            status: true,
            locationType: true,
            patient: true,
        },
        orderBy: {
            start: "desc",
        },
    });
    return appointments.map(convertDatesToString);
}

export async function getDoctorAppointments(
    doctorId: string
): Promise<Appointment[]> {
    const appointments = await prisma.appointment.findMany({
        where: {
            doctorId: doctorId,
        },
        include: {
            type: true,
            status: true,
            locationType: true,
            patient: true,
        },
        orderBy: {
            start: "desc",
        },
    });
    return appointments.map(convertDatesToString);
}

export async function updateAppointmentStatus(
    appointmentId: string,
    statusId: string
): Promise<Appointment> {
    const appointment = await prisma.appointment.update({
        where: {
            id: appointmentId,
        },
        data: {
            statusId: statusId,
        },
        include: {
            type: true,
            status: true,
            locationType: true,
            patient: true,
        },
    });
    return convertDatesToString(appointment);
}
