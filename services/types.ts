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
    createdAt: string;
    updatedAt: string;
};

export type AppointmentStatus = {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
};

export type LocationType = {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
};

export type Appointment = {
    id: string;
    doctorId: string;
    patientId: string;
    reason: string;
    start: string;
    end: string;
    takedAt: string;
    diagnosis: string | null;
    statusId: string;
    typeId: string;
    locationTypeId: string;
    createdAt: string;
    updatedAt: string;
    // Relations
    appointmentType?: AppointmentType;
    appointmentStatus?: AppointmentStatus;
    locationType?: LocationType;
    patient?: User;
};

export type MedicalNote = {
    id: string;
    doctorId: string;
    patientId: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
};
