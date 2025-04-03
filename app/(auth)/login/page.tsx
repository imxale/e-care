"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";

// Composant client qui utilise useSearchParams
function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirectTo");

    const { signIn, isLoading, userRole, user } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRedirecting, setIsRedirecting] = useState(false);

    // Effet pour gérer la redirection après connexion
    useEffect(() => {
        // Si l'utilisateur est connecté et que nous sommes en attente de redirection
        if (user && userRole && isRedirecting && !isLoading) {
            if (redirectTo) {
                router.push(redirectTo);
            } else {
                router.push(`/dashboard/${userRole}`);
            }
        }
    }, [user, userRole, isRedirecting, isLoading, redirectTo, router]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await signIn(email, password);
            
            // Marquer comme en attente de redirection
            // La redirection effective sera gérée par l'useEffect
            setIsRedirecting(true);
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
            setIsRedirecting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className="text-right">
                    <Link
                        href="/forgot-password"
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Mot de passe oublié?
                    </Link>
                </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || isRedirecting}>
                {isLoading || isRedirecting ? "Connexion en cours..." : "Se connecter"}
            </Button>
        </form>
    );
}

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">
                        Connexion
                    </CardTitle>
                    <CardDescription>
                        Entrez vos identifiants pour accéder à votre compte
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<div>Chargement...</div>}>
                        <LoginForm />
                    </Suspense>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <div className="text-sm text-center">
                        Vous n&apos;avez pas de compte?{" "}
                        <Link
                            href="/signup"
                            className="text-blue-600 hover:underline"
                        >
                            S&apos;inscrire
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
