"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { AppointmentList } from "@/components/appointments/AppointmentList";
import { MedicalRecord } from "@/components/medical-records/MedicalRecord";
import { PatientList } from "@/components/medical-records/PatientList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    type Appointment,
    type User,
    type MedicalNote,
} from "@/services";

export default function MedecinDashboard() {
    const router = useRouter();
    const { user, userRole, isLoading, signOut } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [patients, setPatients] = useState<User[]>([]);
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
        null
    );
    const [notes, setNotes] = useState<MedicalNote[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoading && (!user || userRole !== "medecin")) {
            router.push("/login");
        }
    }, [user, userRole, isLoading, router]);

    useEffect(() => {
        const fetchData = async () => {
            if (user?.id) {
                try {
                    setLoading(true);

                    fetch("/api/doctors/" + user.id + "/appointments")
                        .then((res) => res.json())
                        .then((data) => {
                            setAppointments(data);
                        });

                    fetch("/api/doctors/" + user.id + "/patients")
                        .then((res) => res.json())
                        .then((data) => {
                            setPatients(data)
                        });
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

    useEffect(() => {
        const fetchNotes = async () => {
            if (selectedPatientId && user?.id) {
                try {
                    fetch('/api/doctors/' + user.id + '/patients/' + selectedPatientId + '/notes')
                        .then((res) => res.json())
                        .then((data) => {
                            setNotes(data);
                        });
                } catch (error) {
                    console.error(
                        "Erreur lors du chargement des notes:",
                        error
                    );
                }
            }
        };

        fetchNotes();
    }, [selectedPatientId, user?.id]);

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
            if (!user?.id) return;
            fetch('/api/appointments/' + id + '/status', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-type': 'medecin',
                }
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.error) {
                        throw new Error(data.error);
                    }

                    // Mettre à jour la liste des rendez-vous
                    reloadAppointments()
                });
        } catch (error) {
            console.error("Erreur lors de l'annulation du rendez-vous:", error);
        }
    };

    const reloadAppointments = async () => {
        if (user?.id) {
            try {
                fetch('/api/doctors/' + user.id + '/appointments')
                    .then((res) => res.json())
                    .then((data) => {
                        setAppointments(data);
                    });
            } catch (error) {
                console.error("Erreur lors du rechargement des rendez-vous:", error);
            }
        }
    }

    const handleAddNote = async (
        note: Omit<MedicalNote, "id" | "createdAt" | "updatedAt">
    ) => {
        try {
            if (user?.id && selectedPatientId) {
                fetch('/api/doctors/' + user.id + '/patients/' + selectedPatientId + '/notes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(note),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.error) {
                            throw new Error(data.error);
                        }

                        // Mettre à jour la liste des notes
                        setNotes([data, ...notes]);
                    });
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout de la note:", error);
        }
    };

    const handleSelectPatient = (patientId: string) => {
        setSelectedPatientId(patientId);
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
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Tableau de bord médecin</h1>
                <Button onClick={handleLogout} variant="outline">
                    Déconnexion
                </Button>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-800">
                    Bienvenue,{" "}
                    <span className="font-medium">{user?.email}</span>!
                </p>
                <p className="text-green-700 text-sm mt-1">
                    Votre rôle : <span className="font-medium">Médecin</span>
                </p>
            </div>

            <Tabs defaultValue="appointments" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="appointments">
                        Mes rendez-vous
                    </TabsTrigger>
                    <TabsTrigger value="patients">Mes patients</TabsTrigger>
                </TabsList>

                <TabsContent value="appointments" className="space-y-4">
                    <AppointmentList
                        appointments={appointments}
                        onCancel={handleCancelAppointment}
                        userRole="medecin"
                    />
                </TabsContent>

                <TabsContent value="patients" className="space-y-4">
                    {selectedPatientId ? (
                        <div>
                            <Button
                                variant="outline"
                                onClick={() => setSelectedPatientId(null)}
                                className="mb-4"
                            >
                                ← Retour à la liste
                            </Button>
                            <MedicalRecord
                                patientId={selectedPatientId}
                                patientName={
                                    patients.find(
                                        (p) => p.id === selectedPatientId
                                    )?.firstName || "Patient"
                                }
                                notes={notes}
                                onAddNote={handleAddNote}
                                userRole="medecin"
                            />
                        </div>
                    ) : (
                        <PatientList
                            patients={patients}
                            onSelectPatient={handleSelectPatient}
                        />
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
