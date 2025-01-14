'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Clock, Sparkles, ChevronRight, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';
import { useSession } from 'next-auth/react';

interface Plan {
  _id: string;
  courseName: string;
  courseDescription: string;
  createdAt: string;
}

const PlansPage = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [newPlan, setNewPlan] = useState({
    whatToLearn: '',
    whyToLearn: '',
    contentPreferences: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get('/api/plans');
      setPlans(response.data);
      setError(null);
    } catch (err) {
      setError('Error fetching plans');
      console.error('Error fetching plans:', err);
    }
  };

  const { data: session, status } = useSession();
  if (status === 'loading') return null;
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">You need to sign in to view this page.</p>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewPlan({ ...newPlan, [name]: value });
    // Clear form error when user starts typing
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      await axios.post('/api/plans', newPlan);
      setNewPlan({ whatToLearn: '', whyToLearn: '', contentPreferences: '' });
      fetchPlans();
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Your learning plan has been created.",
      });
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Error creating plan. Please try again.');
      console.error('Error creating plan:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-white border-b">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                Create a personalized learning plan with AI
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                We use AI to help you create a personalized and tailored learning plan that
                considers your unique needs and provides the most relevant content.
              </p>
              <Button 
                onClick={() => setIsDialogOpen(true)} 
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Create plan with AI
              </Button>
            </div>
            <div className="relative">
                <div className="relative w-full h-64">
                  <Image
                    src="/learning-illustration.png"
                    alt="Learning illustration"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-2xl shadow-xl"
                  />
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <h2 className="text-3xl font-bold mb-8">Your learning plans</h2>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.length > 0 ? (
            plans.map((plan) => (
              <Card key={plan._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 uppercase tracking-wider">LEARNING PLAN</p>
                  <h3 className="font-semibold text-xl leading-tight">
                  {plan.courseName}
                  </h3>
                  <p className="text-gray-600 line-clamp-2">
                  {plan.courseDescription}
                  </p>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {new Date(plan.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <Link href={`/plans/${plan._id}`}>
                  <Button variant="ghost" className="w-full justify-between">
                  Continue
                  <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                </div>
              </CardContent>
              </Card>
            ))
            ) : (
            <p className="text-gray-600">No learning plans available. Create a new plan to get started!</p>
            )}
        </div>
      </div>

      {/* Create Plan Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Learning Plan</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            {formError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {formError}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="whatToLearn" className="text-sm font-medium">
                What do you want to learn?
              </label>
              <Input
                id="whatToLearn"
                name="whatToLearn"
                value={newPlan.whatToLearn}
                onChange={handleInputChange}
                required
                placeholder="Enter your learning goals..."
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="whyToLearn" className="text-sm font-medium">
                Why do you want to learn?
              </label>
              <Textarea
                id="whyToLearn"
                name="whyToLearn"
                value={newPlan.whyToLearn}
                onChange={handleInputChange}
                required
                placeholder="Explain your motivation..."
                className="min-h-[100px]"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="contentPreferences" className="text-sm font-medium">
                Content preferences
              </label>
              <Textarea
                id="contentPreferences"
                name="contentPreferences"
                value={newPlan.contentPreferences}
                onChange={handleInputChange}
                required
                placeholder="Describe your preferred learning style..."
                className="min-h-[100px]"
                disabled={isSubmitting}
              />
            </div>
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating your plan...
                  </>
                ) : (
                  'Create Plan'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlansPage;

