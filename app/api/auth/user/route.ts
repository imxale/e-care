import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserById } from '@/services/userService';

// POST: Créer un nouvel utilisateur
export async function POST(request: NextRequest) {
  try {
    const { userId, firstName, lastName, role } = await request.json();
    
    // Appel au service pour créer l'utilisateur
    const newUser = await createUser(userId, firstName, lastName, role);
    return NextResponse.json(newUser);
    
  } catch (error: unknown) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    
    // Convertir l'erreur en un type avec propriété message
    const err = error as Error;
    
    // Gestion des erreurs spécifiques
    if (err.message?.includes('existe déjà')) {
      return NextResponse.json(
        { error: err.message },
        { status: 409 }
      );
    }
    
    if (err.message?.includes('obligatoires')) {
      return NextResponse.json(
        { error: err.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'utilisateur' },
      { status: 500 }
    );
  }
}

// GET: Récupérer un utilisateur par ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Le paramètre userId est obligatoire' },
        { status: 400 }
      );
    }

    const user = await getUserById(userId);

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'utilisateur' },
      { status: 500 }
    );
  }
} 