export type User = {
    id: string;
    id_auth: string;
    firstName: string;
    lastName: string;
    doctorId: string | null;
    createdAt: string;
    updatedAt: string;
};

export type AppointmentType = {
    id: string;
    name: string;
};

export type AppointmentStatus = {
    id: string;
    name: string;
};

export type LocationType = {
    id: string;
    name: string;
};

export interface Appointment {
    id: string;
    doctorId: string;
    patientId: string;
    start: Date;
    end: Date;
    reason: string;
    locationTypeId: string;
    typeId: string;
    statusId: string;
    takedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    type?: AppointmentType;
    status?: AppointmentStatus;
    locationType?: LocationType;
    patient?: User;
    doctor?: User;
}

export type MedicalNote = {
    id: string;
    doctorId: string;
    patientId: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
};
