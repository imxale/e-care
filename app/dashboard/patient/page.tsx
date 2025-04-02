"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { AppointmentList } from "@/components/appointments/AppointmentList";
import { CalendarView } from "@/components/appointments/CalendarView";
import { MedicalRecord } from "@/components/medical-records/MedicalRecord";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    getPatientAppointments,
    getPatientMedicalNotes,
    updateAppointmentStatus,
    createAppointment,
    type Appointment,
    type MedicalNote,
} from "@/services";

export default function PatientDashboard() {
    const router = useRouter();
    const { user, userRole, isLoading, signOut } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [notes, setNotes] = useState<MedicalNote[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoading && (!user || userRole !== "patient")) {
            router.push("/login");
        }
    }, [user, userRole, isLoading, router]);

    useEffect(() => {
        const fetchData = async () => {
            if (user?.id) {
                try {
                    setLoading(true);
                    const [appointmentsData, notesData] = await Promise.all([
                        getPatientAppointments(user.id),
                        getPatientMedicalNotes(user.id),
                    ]);
                    setAppointments(appointmentsData);
                    setNotes(notesData);
                } catch (error) {
                    console.error(
                        "Erreur lors du chargement des données:",
                        error
                    );
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [user?.id]);

    const handleLogout = async () => {
        try {
            await signOut();
            router.push("/login");
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
        }
    };

    const handleCancelAppointment = async (id: string) => {
        try {
            await updateAppointmentStatus(id, "status789"); // ID du statut "Annulé"
            setAppointments(
                appointments.map((apt) =>
                    apt.id === id ? { ...apt, statusId: "status789" } : apt
                )
            );
        } catch (error) {
            console.error("Erreur lors de l'annulation du rendez-vous:", error);
        }
    };

    const handleModifyAppointment = (id: string) => {
        // Implement appointment modification logic
        console.log("Modify appointment:", id);
    };

    const handleScheduleAppointment = async (date: Date, timeSlot: string) => {
        try {
            if (!user?.id) return;

            // Créer les dates de début et de fin
            const [hours, minutes] = timeSlot.split(":").map(Number);
            const start = new Date(date);
            start.setHours(hours, minutes, 0, 0);
            const end = new Date(start);
            end.setMinutes(end.getMinutes() + 30); // Durée standard de 30 minutes

            // Créer le rendez-vous
            const newAppointment = await createAppointment(
                "doctor123", // TODO: Permettre la sélection du médecin
                user.id,
                start,
                end,
                "Consultation standard" // TODO: Permettre la saisie du motif
            );

            // Mettre à jour la liste des rendez-vous
            setAppointments([newAppointment, ...appointments]);
        } catch (error) {
            console.error("Erreur lors de la prise de rendez-vous:", error);
        }
    };

    if (isLoading || loading) {
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
                        patientId={user?.id || ""}
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
