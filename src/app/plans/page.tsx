'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewPlan({ ...newPlan, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/plans', newPlan);
      setNewPlan({ whatToLearn: '', whyToLearn: '', contentPreferences: '' });
      fetchPlans();
      setError(null);
    } catch (err) {
      setError('Error creating plan');
      console.error('Error creating plan:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Plans</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* display existing plans */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Existing Plans</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan._id} className="bg-white shadow-md p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-2">{plan.courseName}</h3>
              <p className="text-gray-700">{plan.courseDescription}</p>
              <p className="text-gray-500 mt-2">
                Created at: {new Date(plan.createdAt).toLocaleString()}
              </p>
              <Link href={`/plans/${plan._id}`} className='mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>View Details</Link>
            </div>
          ))}
        </div>
      </div>

      {/* plan creation form */}
      <h2 className="text-xl font-semibold mb-4">Create New Plan</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="whatToLearn"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            What do you want to learn?
          </label>
          <input
            type="text"
            id="whatToLearn"
            name="whatToLearn"
            value={newPlan.whatToLearn}
            onChange={handleInputChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label
            htmlFor="whyToLearn"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Why do you want to learn?
          </label>
          <textarea
            id="whyToLearn"
            name="whyToLearn"
            value={newPlan.whyToLearn}
            onChange={handleInputChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label
            htmlFor="contentPreferences"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Content preferences
          </label>
          <textarea
            id="contentPreferences"
            name="contentPreferences"
            value={newPlan.contentPreferences}
            onChange={handleInputChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create Plan
        </button>
      </form>
    </div>
  );
};

export default PlansPage;