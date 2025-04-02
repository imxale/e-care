"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, FileText, Calendar } from "lucide-react";
import { type MedicalNote } from "@/services";

interface MedicalRecordProps {
    patientId: string;
    patientName: string;
    notes: MedicalNote[];
    onAddNote: (
        note: Omit<MedicalNote, "id" | "createdAt" | "updatedAt">
    ) => Promise<void>;
    userRole: "patient" | "medecin";
}

export function MedicalRecord({
    patientId,
    patientName,
    notes,
    onAddNote,
    userRole,
}: MedicalRecordProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) return;

        try {
            setIsSubmitting(true);
            await onAddNote({
                title,
                content,
                patientId,
                doctorId: "", // Sera rempli par le service
            });
            setTitle("");
            setContent("");
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Erreur lors de l'ajout de la note:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Dossier médical de {patientName}</CardTitle>
                    {userRole === "medecin" && (
                        <Dialog
                            open={isDialogOpen}
                            onOpenChange={setIsDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nouvelle note
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Ajouter une note médicale
                                    </DialogTitle>
                                </DialogHeader>
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Titre</Label>
                                        <Input
                                            id="title"
                                            value={title}
                                            onChange={(e) =>
                                                setTitle(e.target.value)
                                            }
                                            placeholder="Titre de la note"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="content">Contenu</Label>
                                        <Textarea
                                            id="content"
                                            value={content}
                                            onChange={(e) =>
                                                setContent(e.target.value)
                                            }
                                            placeholder="Contenu de la note"
                                            rows={4}
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting
                                            ? "Ajout en cours..."
                                            : "Ajouter une note"}
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    )}
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {notes.map((note) => (
                            <Card key={note.id}>
                                <CardHeader>
                                    <CardTitle>{note.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600">
                                        {new Date(
                                            note.createdAt
                                        ).toLocaleDateString("fr-FR")}
                                    </p>
                                    <p className="mt-2">{note.content}</p>
                                </CardContent>
                            </Card>
                        ))}
                        {notes.length === 0 && (
                            <div className="text-center text-gray-500 py-8">
                                <FileText className="mx-auto h-12 w-12 mb-4" />
                                <p>Aucune note médicale disponible</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
