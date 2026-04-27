from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware # <-- NEW IMPORT
from pydantic import BaseModel
import joblib
import pandas as pd
import os

# 1. Initialize the FastAPI application
app = FastAPI(title="SubGuilt API", version="1.0")

# NEW: Configure CORS so the React frontend is allowed to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your exact Vite frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Define the path to your model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, '..', 'models', 'subguilt_xgboost_v1.0.pkl')

# Load the model into memory when the server starts
try:
    model = joblib.load(MODEL_PATH)
    print("XGBoost Model loaded successfully!")
except Exception as e:
    print(f"Error loading model. Check your file path: {e}")
    model = None

# 3. Define the Input Data Schema (Pydantic)
# FIXED: Added the missing 'service_category_news' feature (14 total features now)
class SubscriptionData(BaseModel):
    monthly_cost_inr: float
    cancellation_difficulty: int
    month_of_year: int
    tenure_months: int
    days_since_last_login: int
    login_freq_30d: int
    avg_session_duration_mins: float
    feature_usage_pct: float
    service_category_news: int  # <-- This was the missing piece!
    service_category_other: int
    service_category_saas: int
    service_category_streaming: int
    price_tier_Mid: int
    price_tier_Premium: int

# 4. The Health Check Endpoint
@app.get("/")
def health_check():
    return {
        "status": "success", 
        "message": "SubGuilt API is officially alive and running!"
    }

# 5. The Prediction Endpoint
@app.post("/predict")
def predict_churn(data: SubscriptionData):
    if model is None:
        raise HTTPException(status_code=500, detail="Model is not loaded into the server.")
    
    # Convert the incoming JSON payload into a pandas DataFrame
    input_df = pd.DataFrame([data.model_dump()])
    
    try:
        # Get the binary prediction (0 = Keep, 1 = Cancel)
        prediction = model.predict(input_df)[0]
        
        # Get the honest probability percentage from the calibrated XGBoost model
        probability = model.predict_proba(input_df)[0][1] 
        
        # Calculate the final Guilt Score
        guilt_score = round(probability * 100, 2)
        
        return {
            "churn_prediction": int(prediction),
            "churn_probability": float(probability),
            "guilt_score_percentage": f"{guilt_score}%",
            "recommendation": "Cancel this subscription immediately!" if prediction == 1 else "Keep it, you actively use it."
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")