import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { 
  getDoctorPatientNotes, 
  getPatientNotes, 
  addMedicalNote 
} from '../../services/medicalNoteService';
import { supabase } from '../../lib/supabase';
import { MedicalNote } from '../../services/types';

// Mock de supabase
jest.mock('../../lib/supabase', () => {
  const mockSupabase = {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn()
          }),
          order: jest.fn()
        })
      }),
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn()
        })
      })
    })
  };
  return { supabase: mockSupabase };
});

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mock-uuid'),
}));

describe('medicalNoteService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock Date pour toISOString
    const mockDate = jest.fn().mockReturnValue('2023-01-01T00:00:00.000Z');
    const mockDateInstance = { toISOString: mockDate } as unknown as Date;
    jest.spyOn(global, 'Date').mockImplementation(() => mockDateInstance);
  });

  describe('getDoctorPatientNotes', () => {
    it('doit récupérer les notes d\'un médecin pour un patient', async () => {
      const mockNotes: MedicalNote[] = [
        { 
          id: 'note1', 
          doctorId: 'doctor1', 
          patientId: 'patient1', 
          title: 'Consultation', 
          content: 'Contenu de la note', 
          createdAt: '2023-01-01T00:00:00.000Z' 
        }
      ];
      const mockResponse = { data: mockNotes, error: null };
      
      // Mock pour la chaîne d'appels
      const orderMock = jest.fn().mockResolvedValue(mockResponse as never);
      const patientMock = jest.fn().mockReturnValue({ order: orderMock });
      const doctorMock = jest.fn().mockReturnValue({ eq: patientMock });
      const selectMock = jest.fn().mockReturnValue({ eq: doctorMock });
      
      (supabase.from as jest.Mock).mockReturnValue({
        select: selectMock
      });

      const result = await getDoctorPatientNotes('doctor1', 'patient1');
      
      expect(supabase.from).toHaveBeenCalledWith('medicalNote');
      expect(selectMock).toHaveBeenCalledWith('*');
      expect(doctorMock).toHaveBeenCalledWith('doctorId', 'doctor1');
      expect(patientMock).toHaveBeenCalledWith('patientId', 'patient1');
      expect(orderMock).toHaveBeenCalledWith('createdAt', { ascending: false });
      expect(result).toEqual(mockNotes);
    });
  });

  describe('getPatientNotes', () => {
    it('doit récupérer toutes les notes d\'un patient', async () => {
      const mockNotes: MedicalNote[] = [
        { 
          id: 'note1', 
          doctorId: 'doctor1', 
          patientId: 'patient1', 
          title: 'Consultation', 
          content: 'Contenu de la note', 
          createdAt: '2023-01-01T00:00:00.000Z' 
        }
      ];
      const mockResponse = { data: mockNotes, error: null };
      
      // Mock pour la chaîne d'appels
      const orderMock = jest.fn().mockResolvedValue(mockResponse as never);
      const patientMock = jest.fn().mockReturnValue({ order: orderMock });
      const selectMock = jest.fn().mockReturnValue({ eq: patientMock });
      
      (supabase.from as jest.Mock).mockReturnValue({
        select: selectMock
      });

      const result = await getPatientNotes('patient1');
      
      expect(supabase.from).toHaveBeenCalledWith('medicalNote');
      expect(selectMock).toHaveBeenCalledWith('*');
      expect(patientMock).toHaveBeenCalledWith('patientId', 'patient1');
      expect(orderMock).toHaveBeenCalledWith('createdAt', { ascending: false });
      expect(result).toEqual(mockNotes);
    });
  });

  describe('addMedicalNote', () => {
    it('doit ajouter une note médicale', async () => {
      const noteData = { 
        doctorId: 'doctor1', 
        patientId: 'patient1', 
        title: 'Consultation', 
        content: 'Contenu de la note'
      };
      
      const expectedNote: MedicalNote = {
        id: 'mock-uuid',
        ...noteData,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      };
      
      const mockResponse = { data: expectedNote, error: null };
      
      // Mock pour la chaîne d'appels
      const singleMock = jest.fn().mockResolvedValue(mockResponse as never);
      const selectMock = jest.fn().mockReturnValue({ single: singleMock });
      const insertMock = jest.fn().mockReturnValue({ select: selectMock });
      
      (supabase.from as jest.Mock).mockReturnValue({
        insert: insertMock
      });

      const result = await addMedicalNote(noteData);
      
      expect(supabase.from).toHaveBeenCalledWith('medicalNote');
      expect(insertMock).toHaveBeenCalledWith({
        id: 'mock-uuid',
        ...noteData,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      });
      expect(result).toEqual(expectedNote);
    });
  });
}); 