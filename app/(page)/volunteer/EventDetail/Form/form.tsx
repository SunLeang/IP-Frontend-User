import { useState } from 'react';
import Head from 'next/head';

export default function VolunteerForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    eventDate: '',
    experience: '',
    motivation: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Thank You!</h2>
          <p className="text-gray-700 mb-6">Your volunteer application has been received. We appreciate your interest in the Sound of Eventura event!</p>
          <div className="bg-green-100 border-l-4 border-green-500 p-4">
            <p className="text-green-700">Our team will review your application and contact you soon.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Volunteer Application | Sound of Eventura</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-indigo-600">Sound of Eventura</h1>
              <p className="mt-2 text-gray-600">Volunteer Application Form</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">
                  Preferred Event Date
                </label>
                <select
                  id="eventDate"
                  name="eventDate"
                  required
                  value={formData.eventDate}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                >
                  <option value="">Select a date</option>
                  <option value="2023-11-16">Sunday, 16 November 2023</option>
                  <option value="2021-01-26">January, 26 Jan 2021</option>
                  <option value="2022-07-30">July 30, 2022</option>
                </select>
              </div>

              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                  Your Experience (if any)
                </label>
                <textarea
                  id="experience"
                  name="experience"
                  rows={3}
                  value={formData.experience}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="motivation" className="block text-sm font-medium text-gray-700">
                  Why do you want to volunteer?
                </label>
                <textarea
                  id="motivation"
                  name="motivation"
                  required
                  rows={4}
                  value={formData.motivation}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Tell us what motivates you to join our event (min. 50 characters)
                </p>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-gray-700">
                    I agree to the volunteer terms
                  </label>
                  <p className="text-gray-500">
                    I understand this is a volunteer position and I meet the basic requirements.
                  </p>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}