"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { AuthService } from "@/services/auth";
import { toast } from "sonner";

type AuthContextType = {
    user: User | null;
    userRole: string | null;
    isLoading: boolean;
    isEmailVerified: boolean;
    signUp: (
        email: string,
        password: string,
        role?: "patient" | "medecin" | "admin",
        metadata?: Record<string, string | number | boolean>
    ) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    resetPasswordRequest: (email: string) => Promise<void>;
    updatePassword: (newPassword: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEmailVerified, setIsEmailVerified] = useState(false);

    const supabase = createClient();

    // Fonction pour obtenir le rôle utilisateur (depuis les métadonnées)
    const getUserRole = (user: User | null) => {
        if (!user) return null;
        return user.user_metadata?.role || "patient";
    };

    useEffect(() => {
        const initUser = async () => {
            try {
                setIsLoading(true);

                // Récupérer la session
                const session = await AuthService.getSession();

                if (session) {
                    const user = session.user;
                    setUser(user);
                    setUserRole(getUserRole(user));
                    setIsEmailVerified(!!user.email_confirmed_at);
                }
            } catch (error) {
                console.error(
                    "Erreur lors de l'initialisation de l'utilisateur:",
                    error
                );
            } finally {
                setIsLoading(false);
            }
        };

        initUser();

        // Écouter les changements d'authentification
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            setIsLoading(true);

            if (session) {
                const user = session.user;
                setUser(user);
                setUserRole(getUserRole(user));
                setIsEmailVerified(!!user.email_confirmed_at);
            } else {
                setUser(null);
                setUserRole(null);
                setIsEmailVerified(false);
            }

            setIsLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signUp = async (
        email: string,
        password: string,
        role: "patient" | "medecin" | "admin" = "patient",
        metadata: Record<string, string | number | boolean> = {}
    ) => {
        try {
            setIsLoading(true);
            await AuthService.signUp({ email, password, role, metadata });
            toast.success("Inscription réussie", {
                description:
                    "Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception.",
            });
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Une erreur est survenue lors de l'inscription.";
            toast.error("Échec de l'inscription", {
                description: errorMessage,
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            const { session } = await AuthService.signIn({ email, password });

            if (session?.user) {
                // Mettre à jour le rôle après connexion
                const role = getUserRole(session.user);
                setUserRole(role);
                
                if (!session.user.email_confirmed_at) {
                    toast.warning("Email non vérifié", {
                        description:
                            "Veuillez vérifier votre email avant de vous connecter.",
                    });
                } else {
                    toast.success("Connexion réussie", {
                        description: "Bienvenue !",
                    });
                }
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Une erreur est survenue lors de la connexion.";
            toast.error("Échec de la connexion", { description: errorMessage });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = async () => {
        try {
            setIsLoading(true);
            await AuthService.signOut();
            // Réinitialiser les états locaux
            setUser(null);
            setUserRole(null);
            setIsEmailVerified(false);
            toast.success("Déconnexion réussie");
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Une erreur est survenue lors de la déconnexion.";
            toast.error("Échec de la déconnexion", {
                description: errorMessage,
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const resetPasswordRequest = async (email: string) => {
        try {
            setIsLoading(true);
            await AuthService.resetPasswordRequest(email);
            toast.success("Email envoyé", {
                description:
                    "Un email de réinitialisation du mot de passe vous a été envoyé.",
            });
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Une erreur est survenue lors de la demande de réinitialisation.";
            toast.error("Échec de l'envoi", { description: errorMessage });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const updatePassword = async (newPassword: string) => {
        try {
            setIsLoading(true);
            await AuthService.updatePassword(newPassword);
            toast.success("Mot de passe mis à jour");
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Une erreur est survenue lors de la mise à jour du mot de passe.";
            toast.error("Échec de la mise à jour", {
                description: errorMessage,
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                userRole,
                isLoading,
                isEmailVerified,
                signUp,
                signIn,
                signOut,
                resetPasswordRequest,
                updatePassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error(
            "useAuth doit être utilisé à l'intérieur d'un AuthProvider"
        );
    }
    return context;
}
