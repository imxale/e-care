// Étendre les types globaux pour Jest

// Déclaration sans import de jest
declare global {
  // Permettre le typage générique des fonctions mock
  interface MockResponse<T> {
    data: T;
    error: Error | null;
  }

  // Extension de l'interface Jest.Mock
  interface JestMock {
    mockResolvedValue<U>(val: U): unknown;
  }
}

// Pour éviter les erreurs TypeScript sur un fichier sans exports
export {}; 