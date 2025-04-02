"use client";

import { useState } from "react";
import { Calendar } from "./Calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { type Appointment } from "@/services";

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

interface CalendarViewProps {
    userRole: "medecin" | "patient";
    appointments: Appointment[];
    onSchedule?: (date: Date, timeSlot: string) => Promise<void>;
    onCancel?: (id: string) => Promise<void>;
}

export function CalendarView({
    userRole,
    appointments,
    onSchedule,
    onCancel,
}: CalendarViewProps) {
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    // Mettre à jour la disponibilité des créneaux en fonction des rendez-vous
    const getAvailableTimeSlots = (date: Date) => {
        return DEFAULT_TIME_SLOTS.map((slot) => {
            const isBooked = appointments.some(
                (apt) =>
                    format(new Date(apt.start), "yyyy-MM-dd") ===
                        format(date, "yyyy-MM-dd") &&
                    format(new Date(apt.start), "HH:mm") === slot.time &&
                    apt.statusId === "status123" // Confirmed
            );
            return {
                ...slot,
                available: !isBooked,
            };
        });
    };

    const handleAction = async () => {
        if (!selectedDate || !selectedTime) return;

        setIsLoading(true);
        try {
            if (userRole === "patient" && onSchedule) {
                await onSchedule(selectedDate, selectedTime);
            }
            // Reset form after successful action
            setSelectedDate(undefined);
            setSelectedTime("");
        } catch (error) {
            console.error("Erreur lors de l'action:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const availableSlots = selectedDate
        ? getAvailableTimeSlots(selectedDate)
        : DEFAULT_TIME_SLOTS;

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {userRole === "patient"
                        ? "Prendre rendez-vous"
                        : "Gérer les disponibilités"}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Date</Label>
                    <Calendar
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Heure</Label>
                    <Select
                        value={selectedTime}
                        onValueChange={setSelectedTime}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une heure" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableSlots.map((slot) => (
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

                {userRole === "patient" && (
                    <Button
                        onClick={handleAction}
                        disabled={!selectedDate || !selectedTime || isLoading}
                        className="w-full"
                    >
                        {isLoading
                            ? "Traitement en cours..."
                            : "Prendre rendez-vous"}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
