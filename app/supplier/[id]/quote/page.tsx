"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Helper component for the progress bar
function ProgressBar({ currentStep }: { currentStep: number }) {
  const steps = [1, 2, 3]; // Define our 3 steps
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
            step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            {step}
          </div>
          {index < steps.length - 1 && (
            <div className={`h-1 w-16 md:w-24 ${step < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          )}
        </div>
      ))}
    </div>
  );
}

// The main page component
export default function QuotePage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const currentStep = parseInt(searchParams.get('step') || '1');

  const supplierId = params.id;
  
  // In a real app, a Server Action would handle form submission here.
  // For this design prompt, we are focusing on the UI and flow.

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <ProgressBar currentStep={currentStep} />

        {/* --- Step 1: Event Details --- */}
        {currentStep === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Step 1: Tell us about your event</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="eventType" className="block text-gray-700 font-bold mb-2">Event Type</label>
                <select id="eventType" name="eventType" className="w-full px-3 py-2 border rounded-lg">
                  <option>Wedding</option>
                  <option>Corporate Event</option>
                  <option>Private Party</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="eventDate" className="block text-gray-700 font-bold mb-2">Event Date</label>
                <input type="date" id="eventDate" name="eventDate" className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div className="flex justify-end">
                <Link href={`/supplier/${supplierId}/quote?step=2`} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg">Next</Link>
              </div>
            </form>
          </div>
        )}

        {/* --- Step 2: Guest & Budget Details --- */}
        {currentStep === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Step 2: Guests & Budget</h2>
            <form>
                 <div className="mb-4">
                    <label htmlFor="guestCount" className="block text-gray-700 font-bold mb-2">Number of Guests</label>
                    <input type="number" id="guestCount" name="guestCount" className="w-full px-3 py-2 border rounded-lg" />
                </div>
                 <div className="mb-4">
                    <label htmlFor="budget" className="block text-gray-700 font-bold mb-2">Your Budget (Optional)</label>
                    <input type="text" id="budget" name="budget" className="w-full px-3 py-2 border rounded-lg" placeholder="e.g., £1000 - £1500" />
                </div>
              <div className="flex justify-between">
                <Link href={`/supplier/${supplierId}/quote?step=1`} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg">Back</Link>
                <Link href={`/supplier/${supplierId}/quote?step=3`} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg">Next</Link>
              </div>
            </form>
          </div>
        )}

        {/* --- Step 3: Confirmation --- */}
        {currentStep === 3 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">Step 3: Confirm & Submit</h2>
            <p className="text-gray-600 mb-6">Please review your details. A request will be sent to the vendor.</p>
            {/* Summary of details would be displayed here */}
            <div className="flex justify-between">
                <Link href={`/supplier/${supplierId}/quote?step=2`} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg">Back</Link>
                <button type="submit" className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg">Submit Request</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}