import { NextResponse } from "next/server";
import { getLocationTypes } from "@/services";

export async function GET() {
    try {
        const locationTypes = await getLocationTypes();
        return NextResponse.json(locationTypes);
    } catch (error) {
        console.error("Erreur lors de la récupération des types :", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération des types" },
            { status: 500 }
        );
    }
}
