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
import { type Appointment } from "@/services";

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
    const getStatusColor = (statusId: string) => {
        switch (statusId) {
            case "status123": // Confirmed
                return "bg-green-100 text-green-800";
            case "status456": // Completed
                return "bg-blue-100 text-blue-800";
            case "status789": // Cancelled
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusText = (statusId: string) => {
        switch (statusId) {
            case "status123":
                return "Confirmé";
            case "status456":
                return "Terminé";
            case "status789":
                return "Annulé";
            default:
                return "En attente";
        }
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Heure</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {appointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                            <TableCell>
                                {new Date(appointment.start).toLocaleDateString(
                                    "fr-FR"
                                )}
                            </TableCell>
                            <TableCell>
                                {new Date(appointment.start).toLocaleTimeString(
                                    "fr-FR",
                                    { hour: "2-digit", minute: "2-digit" }
                                )}
                            </TableCell>
                            <TableCell>
                                {appointment.appointmentType?.name}
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
                            <TableCell className="text-right">
                                {appointment.statusId !== "status789" && (
                                    <>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                onModify(appointment.id)
                                            }
                                            className="mr-2"
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
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
