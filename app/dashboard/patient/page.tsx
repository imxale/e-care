"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { AppointmentList } from "@/components/appointments/AppointmentList";
import { MedicalRecord } from "@/components/medical-records/MedicalRecord";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DoctorSelectionModal } from "@/components/patient/DoctorSelectionModal";
import {
    type Appointment,
    type MedicalNote,
    type AppointmentType,
    type LocationType,
    type User,
} from "@/services/types";

interface TimeSlot {
    id: string;
    time: string;
    available: boolean;
}

const DEFAULT_TIME_SLOTS: TimeSlot[] = [
    { id: "1", time: "09:00", available: true },
    { id: "2", time: "09:30", available: true },
    { id: "3", time: "10:00", available: true },
    { id: "4", time: "10:30", available: true },
    { id: "5", time: "11:00", available: true },
    { id: "6", time: "11:30", available: true },
    { id: "7", time: "14:00", available: true },
    { id: "8", time: "14:30", available: true },
    { id: "9", time: "15:00", available: true },
    { id: "10", time: "15:30", available: true },
];

export default function PatientDashboard() {
    const router = useRouter();
    const { user, userRole, isLoading, signOut } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [notes, setNotes] = useState<MedicalNote[]>([]);
    const [doctors, setDoctors] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        undefined
    );
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
    const [patientDoctor, setPatientDoctor] = useState<User | null>(null);
    const [isDoctorModalOpen, setIsDoctorModalOpen] = useState<boolean>(false);
    const [needsDoctor, setNeedsDoctor] = useState<boolean>(false);

    useEffect(() => {
        if (!isLoading && (!user || userRole !== "patient")) {
            router.push("/login");
        }
    }, [user, userRole, isLoading, router]);

    // Vérifier si le patient a un médecin traitant
    useEffect(() => {
        const checkPatientDoctor = async () => {
            if (user?.id) {
                try {
                    const response = await fetch(`/api/patients/${user.id}/doctor`);
                    
                    if (response.ok) {
                        const doctorData = await response.json();
                        setPatientDoctor(doctorData);
                        setNeedsDoctor(!doctorData);
                    } else {
                        // Si la requête échoue ou si aucun médecin n'est trouvé
                        setPatientDoctor(null);
                        setNeedsDoctor(true);
                    }
                } catch (error) {
                    console.error("Erreur lors de la vérification du médecin traitant:", error);
                    setNeedsDoctor(true);
                }
            }
        };

        if (!isLoading && user) {
            checkPatientDoctor();
        }
    }, [isLoading, user]);

    // Ouvrir automatiquement le modal si le patient n'a pas de médecin traitant
    useEffect(() => {
        if (!loading && needsDoctor) {
            setIsDoctorModalOpen(true);
        }
    }, [loading, needsDoctor]);

    useEffect(() => {
        const fetchData = async () => {
            if (user?.id) {
                try {
                    setLoading(true);

                    fetch('/api/patients/' + user.id + '/appointments')
                        .then((res) => res.json())
                        .then((data) => {
                            setAppointments(data);
                        });

                    fetch('/api/patients/' + user.id + '/medical-notes')
                        .then((res) => res.json())
                        .then((data) => {
                            setNotes(data);
                        });

                    fetch('/api/location-types')
                        .then((res) => res.json())
                        .then((data) => {
                            setLocationTypes(data);
                        });

                    fetch('/api/appointment-types')
                        .then((res) => res.json())
                        .then((data) => {
                            setAppointmentTypes(data);
                        });

                    fetch('/api/doctors')
                        .then((res) => res.json())
                        .then((data) => {
                            setDoctors(data);
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
                    'x-user-type': 'patient',
                },
                body: JSON.stringify({
                    userId: user.id,
                }),
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
                fetch('/api/patients/' + user.id + '/appointments')
                    .then((res) => res.json())
                    .then((data) => {
                        setAppointments(data);
                    });
            } catch (error) {
                console.error("Erreur lors du rechargement des rendez-vous:", error);
            }
        }
    }

    const handleScheduleAppointment = async () => {
        try {
            if (!user?.id || !selectedDate || !selectedTimeSlot) return;

            // Créer les dates de début et de fin
            const [hours, minutes] = selectedTimeSlot.split(":").map(Number);
            const start = new Date(selectedDate);
            start.setHours(hours, minutes, 0, 0);
            const end = new Date(start);
            end.setMinutes(end.getMinutes() + 30); // Durée standard de 30 minutes

            fetch('/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    doctorId: selectedDoctor,
                    patientId: user.id,
                    start: start.toISOString(),
                    end: end.toISOString(),
                    reason,
                    locationTypeId: selectedLocationType,
                    appointmentTypeId: selectedAppointmentType,
                }),
            })
                .then((res) => res.json())
                .then((data => {
                    if (data.error) {
                        throw new Error(data.error);
                    }
                    // Mettre à jour la liste des rendez-vous
                    reloadAppointments()
                }))
                .catch((error) => {
                    console.error("Erreur lors de la création du rendez-vous:", error);
                });

            // Réinitialiser le formulaire
            setSelectedDate(undefined);
            setSelectedTimeSlot(null);
            setSelectedDoctor("");
            setReason("");
            setSelectedLocationType("");
            setSelectedAppointmentType("");
        } catch (error) {
            console.error("Erreur lors de la prise de rendez-vous:", error);
        }
    };

    // Gestionnaire après configuration du médecin traitant
    const handleDoctorSet = async () => {
        // Recharger les données du médecin traitant
        if (user?.id) {
            try {
                const response = await fetch(`/api/patients/${user.id}/doctor`);
                if (response.ok) {
                    const doctorData = await response.json();
                    setPatientDoctor(doctorData);
                    setNeedsDoctor(false);
                }
            } catch (error) {
                console.error("Erreur lors du rechargement du médecin traitant:", error);
            }
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
            
            {/* Afficher les informations du médecin traitant */}
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h2 className="text-lg font-medium mb-2">Votre médecin traitant</h2>
                {patientDoctor ? (
                    <p>
                        Dr. {patientDoctor.firstName} {patientDoctor.lastName}
                    </p>
                ) : (
                    <div className="flex items-center justify-between">
                        <p className="text-gray-500">Vous n&apos;avez pas encore de médecin traitant</p>
                        <Button 
                            onClick={() => setIsDoctorModalOpen(true)}
                            size="sm"
                        >
                            Choisir un médecin
                        </Button>
                    </div>
                )}
            </div>

            <Tabs defaultValue="appointments" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="appointments">Rendez-vous</TabsTrigger>
                    <TabsTrigger value="medical-records">
                        Dossier médical
                    </TabsTrigger>
                    <TabsTrigger value="schedule-appointment">
                        Prendre rendez-vous
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="appointments">
                    <Card>
                        <CardHeader>
                            <CardTitle>Vos rendez-vous</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AppointmentList
                                appointments={appointments}
                                onCancel={handleCancelAppointment}
                                userRole="patient"
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="medical-records">
                    <Card>
                        <CardHeader>
                            <CardTitle>Votre dossier médical</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <MedicalRecord 
                                notes={notes} 
                                patientId={user?.id || ""}
                                patientName={user?.email || "Patient"}
                                onAddNote={async () => {}} // Les patients ne peuvent pas ajouter de notes
                                userRole="patient"
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="schedule-appointment">
                    <Card>
                        <CardHeader>
                            <CardTitle>Prendre un rendez-vous</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="doctor">Médecin</Label>
                                    <Select
                                        value={selectedDoctor}
                                        onValueChange={setSelectedDoctor}
                                    >
                                        <SelectTrigger id="doctor">
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
                                    <Label htmlFor="location-type">
                                        Type de consultation
                                    </Label>
                                    <Select
                                        value={selectedLocationType}
                                        onValueChange={setSelectedLocationType}
                                    >
                                        <SelectTrigger id="location-type">
                                            <SelectValue placeholder="Sélectionner un type" />
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
                                    <Label htmlFor="appointment-type">
                                        Motif de consultation
                                    </Label>
                                    <Select
                                        value={selectedAppointmentType}
                                        onValueChange={setSelectedAppointmentType}
                                    >
                                        <SelectTrigger id="appointment-type">
                                            <SelectValue placeholder="Sélectionner un motif" />
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
                                    <Label htmlFor="reason">Raison</Label>
                                    <Input
                                        id="reason"
                                        value={reason}
                                        onChange={(e) =>
                                            setReason(e.target.value)
                                        }
                                        placeholder="Décrivez brièvement votre situation"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="date">Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !selectedDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {selectedDate ? (
                                                    format(selectedDate, "PPP", { locale: fr })
                                                ) : (
                                                    <span>Choisir une date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={selectedDate}
                                                onSelect={setSelectedDate}
                                                locale={fr}
                                                disabled={(date) =>
                                                    date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                                                    date.getDay() === 0 ||
                                                    date.getDay() === 6
                                                }
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="time">Heure</Label>
                                    <Select
                                        value={selectedTimeSlot || ""}
                                        onValueChange={setSelectedTimeSlot}
                                    >
                                        <SelectTrigger id="time">
                                            <SelectValue placeholder="Sélectionner une heure" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {DEFAULT_TIME_SLOTS.map((slot) => (
                                                <SelectItem
                                                    key={slot.id}
                                                    value={slot.time}
                                                    disabled={!slot.available}
                                                >
                                                    {slot.time}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button
                                    onClick={handleScheduleAppointment}
                                    disabled={
                                        !selectedDoctor ||
                                        !selectedDate ||
                                        !selectedTimeSlot ||
                                        !selectedLocationType ||
                                        !selectedAppointmentType ||
                                        !reason
                                    }
                                    className="w-full mt-6"
                                >
                                    Confirmer le rendez-vous
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Modal de sélection du médecin traitant */}
            <DoctorSelectionModal
                patientId={user?.id || ""}
                isOpen={isDoctorModalOpen}
                onClose={() => {
                    // Ne permettre la fermeture que si le patient a un médecin ou est en mode développement
                    if (patientDoctor || process.env.NODE_ENV === "development") {
                        setIsDoctorModalOpen(false);
                    }
                }}
                onDoctorSet={handleDoctorSet}
            />
        </div>
    );
}
