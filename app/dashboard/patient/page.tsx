"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { AppointmentList } from "@/components/appointments/AppointmentList";
import { CalendarView } from "@/components/appointments/CalendarView";
import { MedicalRecord } from "@/components/medical-records/MedicalRecord";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    getPatientAppointments,
    getPatientMedicalNotes,
    updateAppointmentStatus,
    createAppointment,
    getAppointmentTypes,
    getLocationTypes,
    getDoctors,
    type Appointment,
    type MedicalNote,
    type AppointmentType,
    type LocationType,
    type User,
} from "@/services";

export default function PatientDashboard() {
    const router = useRouter();
    const { user, userRole, isLoading, signOut } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [notes, setNotes] = useState<MedicalNote[]>([]);
    const [doctors, setDoctors] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(
        null
    );
    const [selectedDoctor, setSelectedDoctor] = useState<string>("");
    const [reason, setReason] = useState<string>("");
    const [locationTypes, setLocationTypes] = useState<LocationType[]>([]);
    const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>(
        []
    );
    const [selectedLocationType, setSelectedLocationType] =
        useState<string>("");
    const [selectedAppointmentType, setSelectedAppointmentType] =
        useState<string>("");

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
                    const [
                        appointmentsData,
                        notesData,
                        locationTypesData,
                        appointmentTypesData,
                        doctorsData,
                    ] = await Promise.all([
                        getPatientAppointments(user.id),
                        getPatientMedicalNotes(
                            "0b8e4224-3748-4a98-84f5-ae5d994ca7d5",
                            user.id
                        ),
                        getLocationTypes(),
                        getAppointmentTypes(),
                        getDoctors(),
                    ]);
                    setAppointments(appointmentsData);
                    setNotes(notesData);
                    setLocationTypes(locationTypesData);
                    setAppointmentTypes(appointmentTypesData);
                    setDoctors(doctorsData);
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

    const handleScheduleAppointment = async () => {
        try {
            if (!user?.id || !selectedDate || !selectedTimeSlot) return;

            // Créer les dates de début et de fin
            const [hours, minutes] = selectedTimeSlot.split(":").map(Number);
            const start = new Date(selectedDate);
            start.setHours(hours, minutes, 0, 0);
            const end = new Date(start);
            end.setMinutes(end.getMinutes() + 30); // Durée standard de 30 minutes

            // Créer le rendez-vous
            const newAppointment = await createAppointment(
                selectedDoctor,
                user.id,
                start,
                end,
                reason,
                selectedLocationType,
                selectedAppointmentType
            );

            // Mettre à jour la liste des rendez-vous
            setAppointments([newAppointment, ...appointments]);

            // Réinitialiser le formulaire
            setSelectedDate(null);
            setSelectedTimeSlot(null);
            setSelectedDoctor("");
            setReason("");
            setSelectedLocationType("");
            setSelectedAppointmentType("");
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

                <TabsContent value="schedule" className="space-y-4">
                    <div className="max-w-2xl mx-auto space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="doctor">Médecin</Label>
                            <Select
                                value={selectedDoctor}
                                onValueChange={setSelectedDoctor}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner un médecin" />
                                </SelectTrigger>
                                <SelectContent>
                                    {doctors.map((doctor) => (
                                        <SelectItem
                                            key={doctor.id}
                                            value={doctor.id}
                                        >
                                            Dr. {doctor.firstName}{" "}
                                            {doctor.lastName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">
                                Type de rendez-vous
                            </Label>
                            <Select
                                value={selectedLocationType}
                                onValueChange={setSelectedLocationType}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner le type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {locationTypes.map((type) => (
                                        <SelectItem
                                            key={type.id}
                                            value={type.id}
                                        >
                                            {type.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Type de consultation</Label>
                            <Select
                                value={selectedAppointmentType}
                                onValueChange={setSelectedAppointmentType}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner le type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {appointmentTypes.map((type) => (
                                        <SelectItem
                                            key={type.id}
                                            value={type.id}
                                        >
                                            {type.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reason">
                                Motif de consultation
                            </Label>
                            <Input
                                id="reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Décrivez le motif de votre consultation"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Date et heure du rendez-vous</Label>
                            <CalendarView
                                userRole="patient"
                                appointments={appointments}
                                onSchedule={async (date, timeSlot) => {
                                    setSelectedDate(date);
                                    setSelectedTimeSlot(timeSlot);
                                }}
                            />
                        </div>

                        <Button
                            onClick={handleScheduleAppointment}
                            disabled={
                                !selectedDate ||
                                !selectedTimeSlot ||
                                !selectedDoctor ||
                                !reason ||
                                !selectedLocationType ||
                                !selectedAppointmentType
                            }
                            className="w-full"
                        >
                            Confirmer le rendez-vous
                        </Button>
                    </div>
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
