'use client';

import { useState, useEffect } from 'react';
import { User } from '@/services/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface DoctorSelectionModalProps {
  patientId: string;
  isOpen: boolean;
  onClose: () => void;
  onDoctorSet: () => void; // Callback après la sélection réussie du médecin
}

export function DoctorSelectionModal({
  patientId,
  isOpen,
  onClose,
  onDoctorSet,
}: DoctorSelectionModalProps) {
  const [doctors, setDoctors] = useState<User[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Charger la liste des médecins
  useEffect(() => {
    if (isOpen) {
      const fetchDoctors = async () => {
        setIsLoading(true);
        try {
          const response = await fetch('/api/doctors');
          if (!response.ok) {
            throw new Error('Erreur lors de la récupération des médecins');
          }
          const data = await response.json();
          setDoctors(data);
        } catch (error) {
          console.error('Erreur:', error);
          toast.error('Impossible de charger la liste des médecins');
        } finally {
          setIsLoading(false);
        }
      };

      fetchDoctors();
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!selectedDoctorId) {
      toast.error('Veuillez sélectionner un médecin');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/patients/${patientId}/doctor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ doctorId: selectedDoctorId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'enregistrement');
      }

      toast.success('Médecin traitant défini avec succès');
      onDoctorSet();
      onClose();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Choisir un médecin traitant</DialogTitle>
          <DialogDescription>
            Veuillez sélectionner un médecin traitant pour accéder à toutes les fonctionnalités.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-2">
            <label htmlFor="doctor" className="text-sm font-medium">
              Médecin
            </label>
            <Select
              disabled={isLoading || isSaving}
              value={selectedDoctorId}
              onValueChange={setSelectedDoctorId}
            >
              <SelectTrigger id="doctor">
                <SelectValue placeholder="Sélectionner un médecin" />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value="loading" disabled>
                    Chargement des médecins...
                  </SelectItem>
                ) : doctors.length > 0 ? (
                  doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      Dr. {doctor.firstName} {doctor.lastName}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    Aucun médecin disponible
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSave}
            disabled={isLoading || isSaving || !selectedDoctorId}
          >
            {isSaving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 