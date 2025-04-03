import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { getDoctorPatients } from '../../services/patientService';
import { supabase } from '../../lib/supabase';
import { User } from '../../services/types';

// Mock de supabase
jest.mock('../../lib/supabase', () => {
  const mockSupabase = {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn()
        })
      })
    })
  };
  return { supabase: mockSupabase };
});

describe('patientService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDoctorPatients', () => {
    it('doit récupérer les patients d\'un médecin', async () => {
      const mockPatients: User[] = [
        { id: 'patient1', firstName: 'Jean', lastName: 'Patient', role: 'patient', doctorId: 'doctor1' },
        { id: 'patient2', firstName: 'Marie', lastName: 'Patiente', role: 'patient', doctorId: 'doctor1' }
      ];
      const mockResponse = { data: mockPatients, error: null };
      
      // Type cast pour éviter les erreurs de lint
      const roleMock = jest.fn().mockResolvedValue(mockResponse as never);
      const doctorMock = jest.fn().mockReturnValue({ eq: roleMock });
      const selectMock = jest.fn().mockReturnValue({ eq: doctorMock });
      
      (supabase.from as jest.Mock).mockReturnValue({
        select: selectMock
      });

      const result = await getDoctorPatients('doctor1');
      
      expect(supabase.from).toHaveBeenCalledWith('user');
      expect(selectMock).toHaveBeenCalledWith('*');
      expect(doctorMock).toHaveBeenCalledWith('doctorId', 'doctor1');
      expect(roleMock).toHaveBeenCalledWith('role', 'patient');
      expect(result).toEqual(mockPatients);
    });

    it('doit rejeter si une erreur survient', async () => {
      const mockError = new Error('Erreur de base de données');
      const mockResponse = { data: null, error: mockError };
      
      // Espionner console.error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Type cast pour éviter les erreurs de lint
      const roleMock = jest.fn().mockResolvedValue(mockResponse as never);
      const doctorMock = jest.fn().mockReturnValue({ eq: roleMock });
      const selectMock = jest.fn().mockReturnValue({ eq: doctorMock });
      
      (supabase.from as jest.Mock).mockReturnValue({
        select: selectMock
      });

      await expect(getDoctorPatients('doctor1')).rejects.toThrow('Erreur lors de la récupération des patients');
      
      // Vérifier que console.error a été appelé
      expect(consoleErrorSpy).toHaveBeenCalledWith('Erreur Supabase:', mockError);
      
      // Restaurer console.error
      consoleErrorSpy.mockRestore();
    });
  });
}); 