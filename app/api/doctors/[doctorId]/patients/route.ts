import {NextRequest, NextResponse} from "next/server";
import { getDoctorPatients } from "@/services";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ doctorId: string }> }
) {
    try {
        const patients = await getDoctorPatients((await params).doctorId);
        return NextResponse.json(patients);
    } catch (error) {
        console.error("Erreur lors de la récupération des patients:", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération des patients" },
            { status: 500 }
        );
    }
}
