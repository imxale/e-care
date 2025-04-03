import { NextRequest, NextResponse } from "next/server";
import { getUserById, setPatientDoctor, getPatientDoctor } from "@/services/userService";

// GET: Récupérer le médecin traitant d'un patient
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ patientId: string }> }
) {
  try {
    const { patientId } = await params;
    
    const doctor = await getPatientDoctor(patientId);
    
    return NextResponse.json(doctor);
  } catch (error) {
    console.error("Erreur lors de la récupération du médecin:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du médecin" },
      { status: 500 }
    );
  }
}

// POST: Définir le médecin traitant d'un patient
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ patientId: string }> }
) {
  try {
    const { patientId } = await params;
    const { doctorId } = await request.json();
    
    if (!doctorId) {
      return NextResponse.json(
        { error: "L'ID du médecin est obligatoire" },
        { status: 400 }
      );
    }

    // Vérifier si le patient existe
    const patient = await getUserById(patientId);
    if (!patient) {
      return NextResponse.json(
        { error: "Patient non trouvé" },
        { status: 404 }
      );
    }

    // Mettre à jour le médecin traitant
    const updatedPatient = await setPatientDoctor(patientId, doctorId);
    
    return NextResponse.json(updatedPatient);
  } catch (error: unknown) {
    console.error("Erreur lors de la définition du médecin traitant:", error);
    
    const err = error as Error;
    if (err.message.includes("Médecin non trouvé")) {
      return NextResponse.json(
        { error: err.message },
        { status: 404 }
      );
    }
    
    if (err.message.includes("Patient non trouvé")) {
      return NextResponse.json(
        { error: err.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Erreur lors de la définition du médecin traitant" },
      { status: 500 }
    );
  }
} 