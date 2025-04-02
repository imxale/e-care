"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { AppointmentList } from "@/components/appointments/AppointmentList";
import { CalendarView } from "@/components/appointments/CalendarView";
import { MedicalRecord } from "@/components/medical-records/MedicalRecord";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Appointment {
    id: string;
    date: Date;
    time: string;
    doctorName: string;
    patientName: string;
    status: "scheduled" | "completed" | "cancelled";
}

interface MedicalNote {
    id: string;
    date: Date;
    title: string;
    content: string;
    doctorName: string;
}

// Mock data - replace with actual data from your backend
const mockAppointments: Appointment[] = [
    {
        id: "1",
        date: new Date("2024-04-15"),
        time: "09:00",
        doctorName: "Dr. Example",
        patientName: "John Doe",
        status: "scheduled",
    },
    // Add more mock appointments as needed
];

const mockMedicalNotes: MedicalNote[] = [
    {
        id: "1",
        date: new Date("2024-04-10"),
        title: "Consultation initiale",
        content: "Patient présentant des symptômes de grippe...",
        doctorName: "Dr. Example",
    },
    // Add more mock notes as needed
];

export default function PatientDashboard() {
    const router = useRouter();
    const { user, userRole, isLoading, signOut } = useAuth();
    const [appointments, setAppointments] =
        useState<Appointment[]>(mockAppointments);
    const [notes] = useState<MedicalNote[]>(mockMedicalNotes);

    useEffect(() => {
        if (!isLoading && (!user || userRole !== "patient")) {
            router.push("/login");
        }
    }, [user, userRole, isLoading, router]);

    const handleLogout = async () => {
        try {
            await signOut();
            router.push("/login");
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
        }
    };

    const handleCancelAppointment = async (id: string) => {
        // Implement appointment cancellation logic
        setAppointments(
            appointments.map((apt) =>
                apt.id === id ? { ...apt, status: "cancelled" as const } : apt
            )
        );
    };

    const handleModifyAppointment = (id: string) => {
        // Implement appointment modification logic
        console.log("Modify appointment:", id);
    };

    const handleScheduleAppointment = async (date: Date, timeSlot: string) => {
        // Implement appointment scheduling logic
        const newAppointment: Appointment = {
            id: Date.now().toString(),
            date,
            time: timeSlot,
            doctorName: "Dr. Example", // This should come from the selected doctor
            patientName: user?.email || "Patient", // This should come from the authenticated user
            status: "scheduled",
        };
        setAppointments([...appointments, newAppointment]);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Chargement...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 space-y-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Tableau de bord Patient</h1>
                <Button onClick={handleLogout} variant="outline">
                    Déconnexion
                </Button>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-blue-800">
                    Bienvenue,{" "}
                    <span className="font-medium">{user?.email}</span>!
                </p>
                <p className="text-blue-700 text-sm mt-1">
                    Votre rôle : <span className="font-medium">Patient</span>
                </p>
            </div>

            <Tabs defaultValue="appointments" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="appointments">
                        Mes rendez-vous
                    </TabsTrigger>
                    <TabsTrigger value="schedule">
                        Prendre rendez-vous
                    </TabsTrigger>
                    <TabsTrigger value="records">
                        Mon dossier médical
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="appointments" className="space-y-4">
                    <AppointmentList
                        appointments={appointments}
                        onCancel={handleCancelAppointment}
                        onModify={handleModifyAppointment}
                        userRole="patient"
                    />
                </TabsContent>

                <TabsContent value="schedule">
                    <CalendarView
                        userRole="patient"
                        appointments={appointments}
                        onSchedule={handleScheduleAppointment}
                    />
                </TabsContent>

                <TabsContent value="records">
                    <MedicalRecord
                        patientId="1"
                        patientName={user?.email || "Patient"}
                        notes={notes}
                        onAddNote={async () => {}} // Patients can't add notes
                        userRole="patient"
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
