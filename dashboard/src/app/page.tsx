"use client";

import { useEffect, useState } from "react";

interface PredictionData {
  user_id: string;
  metrics_analyzed: {
    total_watch_time_mins: number;
    days_since_last_session: number;
    avg_session_duration_mins: number;
  };
  guilt_score: number;
  recommendation: string;
}

export default function Dashboard() {
  const [data, setData] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from your local FastAPI backend
    fetch("http://127.0.0.1:8000/api/predict/demo_user_123")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        <p className="text-xl animate-pulse">Calculating Guilt Score...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-red-500">
        <p>Error connecting to FastAPI backend.</p>
      </div>
    );
  }

  const isHighGuilt = data.guilt_score >= 60;

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-white">SubGuilt</h1>
          <p className="text-gray-400 mt-2">Financial Predictor & Fatigue Dashboard</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Main Guilt Score Card */}
          <div className={`col-span-1 md:col-span-3 p-8 rounded-2xl border ${isHighGuilt ? 'bg-red-900/20 border-red-500/50' : 'bg-green-900/20 border-green-500/50'}`}>
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-300 uppercase tracking-wider">Current Guilt Score</h2>
                <p className={`text-6xl font-black mt-2 ${isHighGuilt ? 'text-red-400' : 'text-green-400'}`}>
                  {data.guilt_score}%
                </p>
              </div>
              <div className="mt-6 md:mt-0 text-right">
                <p className="text-sm text-gray-400 uppercase tracking-wider mb-1">Recommendation</p>
                <div className={`px-6 py-3 rounded-lg font-bold text-lg ${isHighGuilt ? 'bg-red-500 text-white' : 'bg-green-500 text-gray-900'}`}>
                  {data.recommendation}
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Total Watch Time</h3>
            <p className="text-3xl font-bold text-white mt-2">{data.metrics_analyzed.total_watch_time_mins} <span className="text-lg text-gray-500 font-normal">mins</span></p>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Avg Session</h3>
            <p className="text-3xl font-bold text-white mt-2">{data.metrics_analyzed.avg_session_duration_mins} <span className="text-lg text-gray-500 font-normal">mins</span></p>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Inactivity Gap</h3>
            <p className="text-3xl font-bold text-white mt-2">{data.metrics_analyzed.days_since_last_session} <span className="text-lg text-gray-500 font-normal">days</span></p>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-600 mt-12">
          <p>Powered by Random Forest ML • Data collected securely via local extension.</p>
        </div>
      </div>
    </main>
  );
}