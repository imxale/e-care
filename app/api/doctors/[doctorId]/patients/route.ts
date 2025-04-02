import { NextResponse } from "next/server";
import { getDoctorPatients } from "@/services";

export async function GET(
    request: Request,
    context: { params: { doctorId: string } }
) {
    console.log(context.params);
    const doctorId = await context.params.doctorId;

    try {
        const patients = await getDoctorPatients(doctorId);
        return NextResponse.json(patients);
    } catch (error) {
        console.error("Erreur lors de la récupération des patients:", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération des patients" },
            { status: 500 }
        );
    }
}
