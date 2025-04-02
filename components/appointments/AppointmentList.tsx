"use client";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { type Appointment } from "@/lib/supabase";

interface AppointmentListProps {
    appointments: Appointment[];
    onCancel: (id: string) => Promise<void>;
    onModify: (id: string) => void;
    userRole: "patient" | "medecin";
}

export function AppointmentList({
    appointments,
    onCancel,
    onModify,
    userRole,
}: AppointmentListProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusColor = (statusId: string) => {
        switch (statusId) {
            case "status789": // En attente
                return "bg-yellow-100 text-yellow-800";
            case "status790": // Confirmé
                return "bg-green-100 text-green-800";
            case "status791": // Annulé
                return "bg-red-100 text-red-800";
            case "status792": // Complété
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusText = (statusId: string) => {
        switch (statusId) {
            case "status789":
                return "En attente";
            case "status790":
                return "Confirmé";
            case "status791":
                return "Annulé";
            case "status792":
                return "Complété";
            default:
                return "Inconnu";
        }
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Heure</TableHead>
                        <TableHead>Motif</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Lieu</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {appointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                            <TableCell>
                                {formatDate(appointment.start)}
                            </TableCell>
                            <TableCell>
                                {formatTime(appointment.start)}
                            </TableCell>
                            <TableCell>{appointment.reason}</TableCell>
                            <TableCell>
                                {appointment.appointmentType?.name}
                            </TableCell>
                            <TableCell>
                                {appointment.locationType?.name}
                            </TableCell>
                            <TableCell>
                                <Badge
                                    className={getStatusColor(
                                        appointment.statusId
                                    )}
                                >
                                    {getStatusText(appointment.statusId)}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex space-x-2">
                                    {appointment.statusId !== "status791" && (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    onModify(appointment.id)
                                                }
                                            >
                                                Modifier
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() =>
                                                    onCancel(appointment.id)
                                                }
                                            >
                                                Annuler
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
