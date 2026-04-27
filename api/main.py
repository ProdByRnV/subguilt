from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import os

# 1. Initialize the FastAPI application
app = FastAPI(title="SubGuilt API", version="1.0")

# Configure CORS to allow the internet (Vercel) to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Define the path to your model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../models/subguilt_xgboost_v1.0.pkl")
model = joblib.load(MODEL_PATH)

# 3. Define the expected data format
class SubscriptionData(BaseModel):
    monthly_cost_inr: float
    cancellation_difficulty: int
    month_of_year: int
    tenure_months: int
    days_since_last_login: int
    login_freq_30d: int
    avg_session_duration_mins: float
    feature_usage_pct: float
    service_category_news: int
    service_category_other: int
    service_category_saas: int
    service_category_streaming: int
    price_tier_Mid: int
    price_tier_Premium: int

# 4. Health Check Endpoint
@app.get("/")
def read_root():
    return {"status": "success", "message": "SubGuilt API is officially alive and running!"}

# 5. Prediction Endpoint
@app.post("/predict")
def predict_guilt(data: SubscriptionData):
    try:
        df = pd.DataFrame([data.model_dump()])
        prediction = model.predict(df)[0]
        probability = model.predict_proba(df)[0][1]
        
        guilt_score = round(probability * 100, 2)
        
        recommendation = "Keep it, you actively use it."
        if prediction == 1:
            recommendation = "Cancel it immediately. You are wasting money."
        elif guilt_score > 50:
            recommendation = "Re-evaluate. You are barely using this."

        return {
            "churn_prediction": int(prediction),
            "guilt_score_percentage": f"{guilt_score}%",
            "recommendation": recommendation
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))