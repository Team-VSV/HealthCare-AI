import React, { useState } from 'react';
import HeartDiseaseForm from './components/HeartDiseaseForm';
import PneumoniaScanner from './components/PneumoniaScanner';
import { Activity, HeartPulse } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('heart');

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
            HealthCare AI Platform
          </h1>
          <p className="mt-2 text-lg text-slate-500">
            Multi-Modal Intelligence Clinical Dashboard
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 inline-flex">
            <button
              onClick={() => setActiveTab('heart')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'heart'
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <HeartPulse className="w-5 h-5" /> Heart Disease
            </button>
            <button
              onClick={() => setActiveTab('pneumonia')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'pneumonia'
                  ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Activity className="w-5 h-5" /> Pneumonia X-Ray
            </button>
          </div>
        </div>
        
        <main>
          {activeTab === 'heart' ? <HeartDiseaseForm /> : <PneumoniaScanner />}
        </main>
      </div>
    </div>
  );
}

export default App;
