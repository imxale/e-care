export interface User {
    id: string;
    firstName: string;
    lastName: string;
    doctorId?: string | null;
    role?: string;
    createdAt?: string;
    updatedAt?: string | null;
}

export interface Appointment {
    id: string;
    doctorId: string;
    patientId: string;
    reason: string;
    start: string;
    end: string;
    takedAt: string;
    diagnosis?: string;
    statusId: string;
    typeId: string;
    locationTypeId: string;
    createdAt: string;
    updatedAt?: string;
    type?: AppointmentType;
    status?: AppointmentStatus;
    locationType?: LocationType;
    doctor?: User;
    patient?: User;
}

export interface AppointmentType {
    id: string;
    name: string;
    createdAt: string;
    updatedAt?: string;
}

export interface AppointmentStatus {
    id: string;
    name: string;
    createdAt: string;
    updatedAt?: string;
}

export interface LocationType {
    id: string;
    name: string;
    createdAt: string;
    updatedAt?: string;
}

export interface MedicalNote {
    id: string;
    doctorId: string;
    patientId: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt?: string;
    doctor?: User;
    patient?: User;
}
