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

interface MedecinAvailabilityProps {
    onSave: (date: Date, timeSlots: TimeSlot[]) => Promise<void>;
}

export function MedecinAvailability({ onSave }: MedecinAvailabilityProps) {
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (!selectedDate || !selectedTime) return;

        setIsLoading(true);
        try {
            await onSave(selectedDate, DEFAULT_TIME_SLOTS);
            // Reset form after successful saving
            setSelectedDate(undefined);
            setSelectedTime("");
        } catch (error) {
            console.error(
                "Erreur lors de la sauvegarde des disponibilités:",
                error
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Gérer les disponibilités</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Date</Label>
                        <Calendar
                            onSelect={setSelectedDate}
                            selected={selectedDate}
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
                        onClick={handleSave}
                        disabled={!selectedDate || !selectedTime || isLoading}
                        className="w-full"
                    >
                        {isLoading
                            ? "Sauvegarde en cours..."
                            : "Enregistrer les disponibilités"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
