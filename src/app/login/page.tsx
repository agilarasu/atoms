"use client";

import { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Github } from 'lucide-react';

export default function LoginPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/plans');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-3xl font-bold text-blue-600">A</span>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-extrabold text-center">Welcome to Atoms</CardTitle>
                    <CardDescription className="text-center">
                        Sign in to start your personalized learning journey
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2 text-center">
                        <p className="text-sm text-gray-600">
                            By continuing, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </div>
                    <Button 
                        className="w-full" 
                        onClick={() => signIn('github', { callbackUrl: '/plans' })}
                    >
                        <Github className="mr-2 h-4 w-4" />
                        Continue with GitHub
                    </Button>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-xs text-gray-600">
                        Atoms. &copy; {new Date().getFullYear()} | All rights reserved
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}

