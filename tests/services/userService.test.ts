import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { 
  createUser, 
  getUserById, 
  getUsersByRole, 
  updateUser, 
  setPatientDoctor, 
  getPatientDoctor 
} from '../../services/userService';
import { supabase } from '../../lib/supabase';

// Mock de supabase
jest.mock('../../lib/supabase', () => {
  const mockSupabase = {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn(),
          eq: jest.fn().mockReturnValue({
            single: jest.fn()
          }),
          order: jest.fn()
        }),
        order: jest.fn()
      }),
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn()
        })
      }),
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn()
          })
        })
      })
    })
  };
  return { supabase: mockSupabase };
});

describe('userService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('doit créer un utilisateur avec succès', async () => {
      const mockUser = { id: 'user123', firstName: 'Jean', lastName: 'Dupont', role: 'patient' };
      const mockResponse = { data: mockUser, error: null };
      
      // Mock pour vérifier si l'utilisateur existe déjà
      const singleMock = jest.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } } as never);
      const eqMock = jest.fn().mockReturnValue({ single: singleMock });
      const selectMock = jest.fn().mockReturnValue({ eq: eqMock });
      
      // Mock pour l'insertion
      const insertSingleMock = jest.fn().mockResolvedValue(mockResponse as never);
      const insertSelectMock = jest.fn().mockReturnValue({ single: insertSingleMock });
      const insertMock = jest.fn().mockReturnValue({ select: insertSelectMock });
      
      (supabase.from as jest.Mock).mockImplementation(() => {
        return {
          select: selectMock,
          insert: insertMock
        };
      });

      const result = await createUser('user123', 'Jean', 'Dupont', 'patient');
      
      expect(supabase.from).toHaveBeenCalledWith('user');
      expect(eqMock).toHaveBeenCalledWith('id', 'user123');
      expect(insertMock).toHaveBeenCalledWith({
        id: 'user123',
        firstName: 'Jean',
        lastName: 'Dupont',
        role: 'patient'
      });
      expect(result).toEqual(mockUser);
    });

    it('doit rejeter si l\'utilisateur existe déjà', async () => {
      // Configuration du mock pour le scénario d'échec
      const singleMock = jest.fn().mockResolvedValue({ data: { id: 'user123' }, error: null } as never);
      const eqMock = jest.fn().mockReturnValue({ single: singleMock });
      const selectMock = jest.fn().mockReturnValue({ eq: eqMock });
      
      (supabase.from as jest.Mock).mockReturnValue({
        select: selectMock
      });

      await expect(createUser('user123', 'Jean', 'Dupont')).rejects.toThrow('Cet utilisateur existe déjà dans la base de données');
      
      expect(supabase.from).toHaveBeenCalledWith('user');
      expect(selectMock).toHaveBeenCalledWith('id');
      expect(eqMock).toHaveBeenCalledWith('id', 'user123');
    });
  });

  describe('getUserById', () => {
    it('doit récupérer un utilisateur par son ID', async () => {
      const mockUser = { id: 'user123', firstName: 'Jean', lastName: 'Dupont', role: 'patient' };
      const mockResponse = { data: mockUser, error: null };
      
      const singleMock = jest.fn().mockResolvedValue(mockResponse as never);
      const eqMock = jest.fn().mockReturnValue({ single: singleMock });
      const selectMock = jest.fn().mockReturnValue({ eq: eqMock });
      
      (supabase.from as jest.Mock).mockReturnValue({
        select: selectMock
      });

      const result = await getUserById('user123');
      
      expect(supabase.from).toHaveBeenCalledWith('user');
      expect(selectMock).toHaveBeenCalledWith('*');
      expect(eqMock).toHaveBeenCalledWith('id', 'user123');
      expect(result).toEqual(mockUser);
    });

    it('doit retourner null si l\'utilisateur n\'est pas trouvé', async () => {
      const mockResponse = { data: null, error: { code: 'PGRST116' } };
      
      const singleMock = jest.fn().mockResolvedValue(mockResponse as never);
      const eqMock = jest.fn().mockReturnValue({ single: singleMock });
      const selectMock = jest.fn().mockReturnValue({ eq: eqMock });
      
      (supabase.from as jest.Mock).mockReturnValue({
        select: selectMock
      });

      const result = await getUserById('nonexistent');
      
      expect(result).toBeNull();
    });
  });

  describe('getUsersByRole', () => {
    it('doit récupérer les utilisateurs par rôle', async () => {
      const mockUsers = [
        { id: 'user1', firstName: 'Jean', lastName: 'Dupont', role: 'patient' },
        { id: 'user2', firstName: 'Marie', lastName: 'Martin', role: 'patient' }
      ];
      const mockResponse = { data: mockUsers, error: null };
      
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue(mockResponse)
        })
      });

      const result = await getUsersByRole('patient');
      
      expect(supabase.from).toHaveBeenCalledWith('user');
      expect(result).toEqual(mockUsers);
    });
  });

  describe('updateUser', () => {
    it('doit mettre à jour un utilisateur', async () => {
      const mockUser = { id: 'user123', firstName: 'Jean', lastName: 'Dupont', role: 'patient' };
      const updateData = { firstName: 'Jean-Pierre' };
      const mockResponse = { data: { ...mockUser, ...updateData }, error: null };
      
      const singleMock = jest.fn().mockResolvedValue(mockResponse as never);
      const selectMock = jest.fn().mockReturnValue({ single: singleMock });
      const eqMock = jest.fn().mockReturnValue({ select: selectMock });
      const updateMock = jest.fn().mockReturnValue({ eq: eqMock });
      
      (supabase.from as jest.Mock).mockReturnValue({
        update: updateMock
      });

      const result = await updateUser('user123', updateData);
      
      expect(supabase.from).toHaveBeenCalledWith('user');
      expect(updateMock).toHaveBeenCalledWith(updateData);
      expect(eqMock).toHaveBeenCalledWith('id', 'user123');
      expect(result).toEqual({ ...mockUser, ...updateData });
    });
  });

  describe('setPatientDoctor', () => {
    it('doit associer un patient à un médecin', async () => {
      const mockPatient = { id: 'patient1', firstName: 'Jean', lastName: 'Patient', role: 'patient' };
      const mockDoctor = { id: 'doctor1', firstName: 'Marie', lastName: 'Docteur', role: 'medecin' };
      const mockUpdatedPatient = { ...mockPatient, doctorId: 'doctor1' };
      
      // Mock pour la vérification du patient
      const patientSingleMock = jest.fn().mockResolvedValue({ data: mockPatient, error: null } as never);
      
      // Mock pour la vérification du médecin
      const doctorSingleMock = jest.fn().mockResolvedValue({ data: mockDoctor, error: null } as never);
      
      // Mock pour la mise à jour
      const updateSingleMock = jest.fn().mockResolvedValue({ data: mockUpdatedPatient, error: null } as never);
      
      let callCount = 0;
      (supabase.from as jest.Mock).mockImplementation(() => {
        callCount++;
        if (callCount === 1 || callCount === 2) {
          // Pour les vérifications de patient et médecin
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                  single: callCount === 1 ? patientSingleMock : doctorSingleMock
                })
              })
            })
          };
        } else {
          // Pour la mise à jour
          return {
            update: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                select: jest.fn().mockReturnValue({
                  single: updateSingleMock
                })
              })
            })
          };
        }
      });

      const result = await setPatientDoctor('patient1', 'doctor1');
      
      expect(supabase.from).toHaveBeenCalledWith('user');
      expect(result).toEqual(mockUpdatedPatient);
    });
  });

  describe('getPatientDoctor', () => {
    it('doit récupérer le médecin d\'un patient', async () => {
      const mockPatient = { id: 'patient1', doctorId: 'doctor1' };
      const mockDoctor = { id: 'doctor1', firstName: 'Marie', lastName: 'Docteur', role: 'medecin' };
      
      // Mock pour récupérer le patient
      const patientSingleMock = jest.fn().mockResolvedValue({ data: mockPatient, error: null } as never);
      
      // Mock pour récupérer le médecin
      const doctorSingleMock = jest.fn().mockResolvedValue({ data: mockDoctor, error: null } as never);
      
      let callCount = 0;
      (supabase.from as jest.Mock).mockImplementation(() => {
        callCount++;
        return {
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: callCount === 1 ? patientSingleMock : doctorSingleMock
            })
          })
        };
      });

      const result = await getPatientDoctor('patient1');
      
      expect(supabase.from).toHaveBeenCalledWith('user');
      expect(result).toEqual(mockDoctor);
    });

    it('doit retourner null si le patient n\'a pas de médecin', async () => {
      const mockPatient = { id: 'patient1', doctorId: null };
      
      // Mock pour récupérer le patient sans doctorId
      const patientSingleMock = jest.fn().mockResolvedValue({ data: mockPatient, error: null } as never);
      
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: patientSingleMock
          })
        })
      });

      const result = await getPatientDoctor('patient1');
      
      expect(result).toBeNull();
    });
  });
}); 