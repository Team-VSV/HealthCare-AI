import React, { useState } from 'react';
import axios from 'axios';
import { HeartPulse, Activity, AlertCircle, CheckCircle } from 'lucide-react';

const API_URL = "http://localhost:8000/api/predict/heart-disease";

export default function HeartDiseaseForm() {
  const [formData, setFormData] = useState({
    age: 50, sex: 1, cp: 1, trestbps: 120, chol: 200, fbs: 0,
    restecg: 0, thalach: 150, exang: 0, oldpeak: 1.0, slope: 1, ca: 0, thal: 3
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await axios.post(API_URL, formData);
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Failed to connect to AI engine.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto border border-gray-100 transition-all duration-300 hover:shadow-2xl">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
        <div className="p-3 bg-red-50 text-red-500 rounded-xl">
          <HeartPulse size={28} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Heart Disease Risk AI</h2>
          <p className="text-gray-500 text-sm mt-1">Predict coronary disease probability using 13 clinical factors</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Core Demographics */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Age</label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Sex</label>
          <select name="sex" value={formData.sex} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
            <option value={1}>Male</option>
            <option value={0}>Female</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Chest Pain Type (cp)</label>
          <select name="cp" value={formData.cp} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
            <option value={1}>Typical Angina</option>
            <option value={2}>Atypical Angina</option>
            <option value={3}>Non-anginal Pain</option>
            <option value={4}>Asymptomatic</option>
          </select>
        </div>

        {/* Vitals */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Resting BP (mm Hg)</label>
          <input type="number" name="trestbps" value={formData.trestbps} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Cholesterol (mg/dl)</label>
          <input type="number" name="chol" value={formData.chol} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Max Heart Rate</label>
          <input type="number" name="thalach" value={formData.thalach} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        {/* Binary/Categorical metrics */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Fasting Blood Sugar {'>'} 120</label>
          <select name="fbs" value={formData.fbs} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
            <option value={1}>True</option>
            <option value={0}>False</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Resting ECG</label>
          <select name="restecg" value={formData.restecg} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
            <option value={0}>Normal</option>
            <option value={1}>ST-T Wave Abnormality</option>
            <option value={2}>LV Hypertrophy</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Exercise Angina</label>
          <select name="exang" value={formData.exang} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
            <option value={1}>Yes</option>
            <option value={0}>No</option>
          </select>
        </div>
        
        {/* Advanced Metrics */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Oldpeak (ST Depression)</label>
          <input type="number" step="0.1" name="oldpeak" value={formData.oldpeak} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Slope</label>
          <select name="slope" value={formData.slope} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
            <option value={1}>Upsloping</option>
            <option value={2}>Flat</option>
            <option value={3}>Downsloping</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Major Vessels (0-3)</label>
          <input type="number" name="ca" value={formData.ca} min="0" max="3" onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Thalassemia</label>
          <select name="thal" value={formData.thal} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
            <option value={3}>Normal</option>
            <option value={6}>Fixed Defect</option>
            <option value={7}>Reversable Defect</option>
          </select>
        </div>

        <div className="md:col-span-2 lg:col-span-3 flex justify-end mt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? <Activity className="animate-spin" size={20} /> : <Activity size={20} />}
            {loading ? "Analyzing Data..." : "Run AI Analysis"}
          </button>
        </div>
      </form>

      {/* Results Section */}
      {error && (
        <div className="mt-8 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 border border-red-100">
          <AlertCircle size={20} />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {result && (
        <div className={`mt-8 p-6 rounded-2xl border ${result.prediction === 1 ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'} transition-all duration-500 animate-fade-in`}>
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${result.prediction === 1 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
              {result.prediction === 1 ? <AlertCircle size={28} /> : <CheckCircle size={28} />}
            </div>
            <div>
              <h3 className={`text-xl font-bold ${result.prediction === 1 ? 'text-red-700' : 'text-emerald-700'}`}>
                {result.risk_level}
              </h3>
              <p className={`mt-1 text-sm ${result.prediction === 1 ? 'text-red-600 opacity-90' : 'text-emerald-600 opacity-90'}`}>
                The AI model analyzed your clinical parameters with a confidence score of <strong>{(result.confidence * 100).toFixed(1)}%</strong>. 
                {result.prediction === 1 
                  ? " Please consult with a cardiologist for a thorough examination." 
                  : " Your metrics appear normal, but maintain regular checkups."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
