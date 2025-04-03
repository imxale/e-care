"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { type User } from "@/services";

interface PatientListProps {
    patients: User[];
    onSelectPatient: (patientId: string) => void;
}

export function PatientList({ patients, onSelectPatient }: PatientListProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredPatients = patients.filter((patient) =>
        `${patient.firstName} ${patient.lastName}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Liste des patients</CardTitle>
                <div className="relative mt-2">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher un patient..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nom</TableHead>
                            <TableHead>Prénom</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPatients.map((patient) => (
                            <TableRow key={patient.id}>
                                <TableCell>{patient.lastName}</TableCell>
                                <TableCell>{patient.firstName}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            onSelectPatient(patient.id)
                                        }
                                    >
                                        Voir le dossier
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
