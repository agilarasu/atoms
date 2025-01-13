'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';

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

  if (error) {
    return <div className='container mx-auto px-4 py-8'><p className="text-red-500 mb-4">{error}</p></div>
  }
  if (!plan) {
    return <div className='container mx-auto px-4 py-8'>Loading...</div>
  }
  return (
      <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Plan Details</h1>

          <div className="bg-white shadow-md p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-2">{plan.courseName}</h3>
                <p className="text-gray-700">{plan.courseDescription}</p>
                <ul className='list-disc'>
                    {plan.courseOutcomes.map((outcome,index) => (
                        <li key={index}>{outcome}</li>
                    ))}
                </ul>
              <h4 className='text-md font-semibold mt-2 mb-1'>Modules</h4>
              {plan.modules.map((module) => (
                  <div key={module._id} className='bg-gray-100 p-2 rounded-md mt-2'>
                      <p className='text-gray-700'>
                            <span className='font-semibold'>Module Name : </span> {module.name}
                      </p>
                        <ul className='list-disc'>
                            {module.lessons.map((lesson,index) => (
                                <li key={index}>{lesson}</li>
                            ))}
                        </ul>
                  </div>
              ))}
              <p className="text-gray-500 mt-2">
                  Created at: {new Date(plan.createdAt).toLocaleString()}
              </p>

          </div>

          <div className='mt-4'>
            <h2 className="text-xl font-semibold mb-4">User Input Details:</h2>
            <div className="bg-white shadow-md p-4 rounded-md">
                <p><span className="font-semibold">What to Learn:</span> {plan.whatToLearn}</p>
                <p><span className="font-semibold">Why to Learn:</span> {plan.whyToLearn}</p>
                <p><span className="font-semibold">Content Preferences:</span> {plan.contentPreferences}</p>
            </div>
          </div>

      </div>
  );
};

export default PlanDetailsPage;