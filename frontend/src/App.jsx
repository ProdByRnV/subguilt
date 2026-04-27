import { useState, useEffect } from 'react'

function App() {
  const [formData, setFormData] = useState({
    monthly_cost_inr: 499,
    cancellation_difficulty: 3,
    tenure_months: 12,
    days_since_last_login: 15,
    login_freq_30d: 2,
    avg_session_duration_mins: 10,
    feature_usage_pct: 0.2, 
    category: 'streaming',
    tier: 'Mid'
  })

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [apiStatus, setApiStatus] = useState("Checking local connection...")

  // Ping the local Python server on load
  useEffect(() => {
    fetch('http://127.0.0.1:8000/')
      .then(response => response.json())
      .then(data => setApiStatus("Live on Localhost!"))
      .catch(error => setApiStatus("Server offline or CORS blocked."))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: e.target.type === 'number' || e.target.type === 'range' ? Number(value) : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    const currentMonth = new Date().getMonth() + 1

    const payload = {
      monthly_cost_inr: formData.monthly_cost_inr,
      cancellation_difficulty: formData.cancellation_difficulty,
      month_of_year: currentMonth,
      tenure_months: formData.tenure_months,
      days_since_last_login: formData.days_since_last_login,
      login_freq_30d: formData.login_freq_30d,
      avg_session_duration_mins: formData.avg_session_duration_mins,
      feature_usage_pct: formData.feature_usage_pct,
      service_category_news: formData.category === 'news' ? 1 : 0,
      service_category_other: formData.category === 'other' ? 1 : 0,
      service_category_saas: formData.category === 'saas' ? 1 : 0,
      service_category_streaming: formData.category === 'streaming' ? 1 : 0,
      price_tier_Mid: formData.tier === 'Mid' ? 1 : 0,
      price_tier_Premium: formData.tier === 'Premium' ? 1 : 0,
    }

    try {
      // Pointing directly to the local Python backend
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-indigo-400 tracking-tight mb-2">SubGuilt</h1>
          <p className="text-lg text-gray-400 mb-2">Calculate the brutal truth about your subscriptions.</p>
          <span className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-full border border-gray-700">API Status: {apiStatus}</span>
        </div>

        <div className="bg-gray-900 rounded-xl shadow-2xl border border-gray-800 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Service Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option value="streaming">Streaming (Netflix, Spotify)</option>
                    <option value="saas">SaaS (Adobe, Notion)</option>
                    <option value="news">News/Media (NYT, Medium)</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Price Tier</label>
                  <select name="tier" value={formData.tier} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option value="Basic">Basic</option>
                    <option value="Mid">Mid/Standard</option>
                    <option value="Premium">Premium/Pro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Monthly Cost (₹)</label>
                  <input type="number" name="monthly_cost_inr" value={formData.monthly_cost_inr} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Months Subscribed</label>
                  <input type="number" name="tenure_months" value={formData.tenure_months} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Days Since Login</label>
                  <input type="number" name="days_since_last_login" value={formData.days_since_last_login} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Logins (Last 30 Days)</label>
                  <input type="number" name="login_freq_30d" value={formData.login_freq_30d} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Avg Session (Mins)</label>
                  <input type="number" name="avg_session_duration_mins" value={formData.avg_session_duration_mins} onChange={handleChange} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-indigo-500 outline-none" required />
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 flex justify-between">
                    <span>Feature Usage ({Math.round(formData.feature_usage_pct * 100)}%)</span>
                  </label>
                  <input type="range" name="feature_usage_pct" min="0" max="1" step="0.05" value={formData.feature_usage_pct} onChange={handleChange} className="w-full accent-indigo-500" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1 flex justify-between">
                    <span>Cancellation Difficulty ({formData.cancellation_difficulty}/5)</span>
                  </label>
                  <input type="range" name="cancellation_difficulty" min="1" max="5" step="1" value={formData.cancellation_difficulty} onChange={handleChange} className="w-full accent-indigo-500" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 mt-6 disabled:opacity-50 flex justify-center">
                {loading ? 'Analyzing...' : 'Calculate Guilt Score'}
              </button>
            </form>
          </div>

          {error && (
            <div className="bg-red-900/50 border-t border-red-800 p-6 text-red-200 text-center">
              Error: {error}
            </div>
          )}

          {result && !error && (
            <div className={`p-8 border-t border-gray-800 transition-all duration-500 ${result.churn_prediction === 1 ? 'bg-red-950/30' : 'bg-green-950/30'}`}>
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">Your Guilt Score</h2>
                <div className={`text-6xl font-black mb-4 ${result.churn_prediction === 1 ? 'text-red-500' : 'text-green-500'}`}>
                  {result.guilt_score_percentage}
                </div>
                <p className="text-xl text-gray-300 italic">"{result.recommendation}"</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App