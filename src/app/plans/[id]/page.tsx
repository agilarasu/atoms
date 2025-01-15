'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Share2, Copy, ChevronRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Module {
    name: string;
    lessons: string[];
    _id: string;
}

interface Plan {
    _id: string;
    whatToLearn: string;
    whyToLearn: string;
    contentPreferences: string;
    courseName: string;
    courseDescription: string;
    courseOutcomes: string[];
    modules: Module[];
    createdAt: string;
}

const PlanDetailsPage = () => {
    const params = useParams();
    const [plan, setPlan] = useState<Plan | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlan = async () => {
            try {
                const response = await axios.get(`/api/plans/${params.id}`);
                setPlan(response.data);
                setError(null);
            } catch (err) {
                setError('Error fetching plan');
                console.error('Error fetching plan:', err);
            }
        };
    
        fetchPlan();
    }, [params.id]);

      const { data: session, status } = useSession();
      if (status === 'loading') return null;
      if (!session) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-600">You need to sign in to view this page.</p>
          </div>
        );
      }
    

    if (error) {
        return <div className='container mx-auto px-4 py-8'><p className="text-red-500 mb-4">{error}</p></div>
    }

    if (!plan) {
        return <div className='container mx-auto px-4 py-8'>Loading...</div>
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="bg-[#1a237e] text-white px-4 py-12 md:py-16 relative overflow-hidden">
                <div 
                    className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900"
                    style={{
                        backgroundImage: "url('/plan-banner.jpg')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: 0.8
                    }}
                />
                <div className="container mx-auto relative z-10">
                    <div className="mb-8">
                        <div className="text-sm font-medium mb-2 opacity-90">AI PLAN</div>
                        <h1 className="text-4xl font-bold mb-4">{plan.courseName}</h1>
                        <p className="text-lg opacity-90 max-w-3xl mb-6">{plan.courseDescription}</p>
                        <div className="flex items-center gap-2 text-sm opacity-80">
                            <span>Published on {new Date(plan.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
                            Start
                        </Button>
                        <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                        </Button>
                        <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                        </Button>
                    </div>
                    <div className="mt-4 p-4 bg-yellow-100 text-yellow-800 rounded">
                        <p>These features are not implemented yet. In the meantime, you can interact with our <Link href="/chat" className="text-blue-500 underline">chatbot</Link> to get started.</p>
                    </div>
                </div>
            </div>

            {/* Main Content with Sidebar Layout */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Learning Outcomes Card */}
                        <Card className="p-4 sticky top-4">
                            <h2 className="text-lg font-semibold mb-4">Learning outcomes</h2>
                            <ul className="space-y-2">
                                {plan.courseOutcomes.map((outcome, index) => (
                                    <li key={index} className="flex gap-2 text-sm">
                                        <ChevronRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <span>{outcome}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Learning Context */}
                            <div className="mt-6 pt-6 border-t">
                                <h2 className="text-lg font-semibold mb-4">Learning Context</h2>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-1">What to Learn</h3>
                                        <p className="text-sm text-gray-600">{plan.whatToLearn}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-1">Why to Learn</h3>
                                        <p className="text-sm text-gray-600">{plan.whyToLearn}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-1">Content Preferences</h3>
                                        <p className="text-sm text-gray-600">{plan.contentPreferences}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Main Content - Modules */}
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Modules in this Plan</h2>
                        <div className="space-y-4">
                            {plan.modules.map((module, index) => (
                                <Card key={module._id} className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold mb-2">{module.name}</h3>
                                            <div className="flex items-center text-sm text-gray-600 mb-4">
                                                <Clock className="w-4 h-4 mr-2" />
                                                <span>{module.lessons.length} lessons</span>
                                            </div>
                                            <ul className="space-y-2">
                                                {module.lessons.map((lesson, lessonIndex) => (
                                                    <li key={lessonIndex} className="flex items-start gap-2">
                                                        <ChevronRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                                        <span>{lesson}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanDetailsPage;

