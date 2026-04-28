from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import os

app = FastAPI(title="SubGuilt API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "../models/subguilt_xgboost_v1.0.pkl")
model = joblib.load(MODEL_PATH)

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

@app.get("/")
def read_root():
    return {"status": "success", "message": "SubGuilt API is officially alive and running locally!"}

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