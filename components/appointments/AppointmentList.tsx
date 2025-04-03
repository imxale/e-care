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
    userRole: "patient" | "medecin";
}

export function AppointmentList({
    appointments,
    onCancel,
}: AppointmentListProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Heure</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Raison</TableHead>
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
                                {new Date(
                                    new Date(appointment.start).getTime() +
                                        2 * 60 * 60 * 1000
                                ).toLocaleTimeString("fr-FR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </TableCell>
                            <TableCell>{appointment.type?.name}</TableCell>
                            <TableCell>
                                {appointment.reason ||
                                    "Raison non spécifiée"}
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Badge
                                        className={
                                            appointment.status?.name ===
                                            "Confirmé"
                                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                                : appointment.status?.name ===
                                                  "En attente"
                                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                                : appointment.status?.name ===
                                                      "Annulé" ||
                                                  appointment.status?.name ===
                                                      "Annulé par le patient" ||
                                                  appointment.status?.name ===
                                                      "Annulé par le médecin"
                                                ? "bg-red-100 text-red-800 hover:bg-red-200"
                                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                        }
                                    >
                                        {appointment.status?.name ||
                                            "Statut inconnu"}
                                    </Badge>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                {appointment.status?.name !==
                                    "Annulé par le patient" &&
                                    appointment.status?.name !==
                                        "Annulé par le médecin" && (
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() =>
                                                onCancel(appointment.id)
                                            }
                                        >
                                            Annuler
                                        </Button>
                                    )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
