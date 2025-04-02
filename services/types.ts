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

export type Appointment = {
    id: string;
    doctorId: string;
    patientId: string;
    reason: string;
    start: Date;
    end: Date;
    takedAt: Date;
    diagnosis?: string;
    statusId: string;
    typeId: string;
    locationTypeId: string;
    createdAt: Date;
    updatedAt: Date;
    type?: AppointmentType;
    status?: AppointmentStatus;
    locationType?: LocationType;
    doctor?: any;
    patient?: any;
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
