import React, { useState, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, FileImage, ShieldAlert, ShieldCheck, Activity } from 'lucide-react';

const PneumoniaScanner = () => {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) processFile(selectedFile);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) processFile(droppedFile);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const processFile = (selectedFile) => {
        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
        setResult(null);
        setError(null);
    };

    const handleScan = async () => {
        if (!file) return;
        
        setLoading(true);
        setError(null);
        
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:8000/api/predict/pneumonia', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if (response.data.error) throw new Error(response.data.error);
            setResult(response.data);
        } catch (err) {
            setError(err.message || 'Error communicating with the server. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    const isHighRisk = result?.confidence > 50 && result?.risk_level?.includes('High');

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 max-w-3xl mx-auto transition-all duration-300">
            <div className="bg-gradient-to-r from-teal-500 to-emerald-600 px-8 py-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Activity className="w-6 h-6" /> Pneumonia X-Ray Scanner
                </h2>
                <p className="text-emerald-100 mt-2">Upload a chest X-Ray (JPEG/PNG) to analyze for signs of pneumonia using our MobileNet CNN model.</p>
            </div>

            <div className="p-8">
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-colors"
                >
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept="image/jpeg, image/png, image/jpg"
                    />
                    
                    {previewUrl ? (
                        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                            <img src={previewUrl} alt="X-Ray Preview" className="max-h-64 rounded-lg shadow-md mb-4" />
                            <p className="text-sm text-slate-500 flex justify-center gap-1 items-center">
                                <FileImage className="w-4 h-4" /> {file.name}
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-slate-500 py-10">
                            <UploadCloud className="w-16 h-16 text-slate-400 mb-4" />
                            <p className="text-xl font-medium text-slate-700">Click or drag image to upload</p>
                            <p className="text-sm mt-2">Supports JPG, PNG</p>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex justify-center">
                    <button 
                        onClick={handleScan}
                        disabled={!file || loading}
                        className={`px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all duration-300 ${
                            !file || loading 
                            ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-xl hover:scale-105'
                        }`}
                    >
                        {loading ? 'Analyzing Scan...' : 'Scan Image'}
                    </button>
                </div>

                {error && (
                    <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-2">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {result && (
                    <div className={`mt-8 p-6 rounded-xl border-2 ${isHighRisk ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'} transition-all duration-500 animate-in fade-in slide-in-from-bottom-4`}>
                        <div className="flex items-start gap-4">
                            <div className={`p-4 rounded-full ${isHighRisk ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                {isHighRisk ? <ShieldAlert className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
                            </div>
                            <div className="flex-1">
                                <h3 className={`text-2xl font-bold ${isHighRisk ? 'text-red-800' : 'text-green-800'} mb-2`}>
                                    {result.risk_level}
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between text-sm text-slate-500 font-medium mb-1">
                                            <span>AI Confidence Score</span>
                                            <span className="font-bold text-slate-700">{result.confidence.toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-3">
                                            <div 
                                                className={`h-3 rounded-full ${isHighRisk ? 'bg-red-500' : 'bg-green-500'} transition-all duration-1000 ease-out`} 
                                                style={{ width: `${Math.max(10, result.confidence)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-600 pt-2 border-t border-slate-200/60 mt-4">
                                        <strong>Note:</strong> This is an AI assessment generated by a Convolutional Neural Network intended for clinical support. An expert radiologist must independently verify these findings.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PneumoniaScanner;
