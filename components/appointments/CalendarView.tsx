"use client";

import { useState } from "react";
import { Calendar } from "./Calendar";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CardContent } from "@/components/ui/card";
import { format } from "date-fns";
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

export function CalendarView({ appointments }: CalendarViewProps) {
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [selectedTime, setSelectedTime] = useState<string>("");

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

    const availableSlots = selectedDate
        ? getAvailableTimeSlots(selectedDate)
        : DEFAULT_TIME_SLOTS;

    return (
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label>Date</Label>
                <Calendar selected={selectedDate} onSelect={setSelectedDate} />
            </div>

            <div className="space-y-2">
                <Label>Heure</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
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
        </CardContent>
    );
}
