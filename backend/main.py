from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import func
import logging
import joblib
import pandas as pd
import datetime
from database import SessionLocal, DBSessionRecord, get_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    ml_model = joblib.load('guilt_model.pkl')
    logger.info("Loaded ML Model successfully.")
except FileNotFoundError:
    logger.warning("guilt_model.pkl not found. Please run ml_engine.py first.")
    ml_model = None

app = FastAPI(
    title="SubGuilt API",
    description="Backend for the SubGuilt prediction engine.",
    version="1.2.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class WatchSession(BaseModel):
    platform: str
    event_type: str
    session_start: str
    session_end: str
    duration_minutes: float
    device_type: str

class TrackPayload(BaseModel):
    user_id: str
    sessions: List[WatchSession]

@app.get("/")
async def root():
    return {"status": "SubGuilt API is running and connected to Database.", "ml_model_loaded": ml_model is not None}

@app.post("/api/track")
async def track_sessions(payload: TrackPayload, db: Session = Depends(get_db)):
    """Receives batched watch sessions and saves them permanently."""
    try:
        db_records = []
        for session in payload.sessions:
            new_record = DBSessionRecord(
                user_id=payload.user_id,
                platform=session.platform,
                event_type=session.event_type,
                session_start=session.session_start,
                session_end=session.session_end,
                duration_minutes=session.duration_minutes,
                device_type=session.device_type
            )
            db.add(new_record)
            db_records.append(new_record)

        db.commit()
        return {"status": "success", "message": f"Successfully saved {len(db_records)} sessions to the database."}
    
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to process payload: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error while saving to database.")

@app.get("/api/predict/{user_id}")
async def predict_guilt(user_id: str, db: Session = Depends(get_db)):
    """Calculates user stats from the DB and feeds them to the ML model."""
    if ml_model is None:
        raise HTTPException(status_code=503, detail="ML Model not loaded.")

    sessions = db.query(DBSessionRecord).filter(DBSessionRecord.user_id == user_id).all()
    
    if not sessions:
        return {"user_id": user_id, "guilt_score": 100, "message": "No watch history found. 100% Guilt. Cancel immediately."}

    total_watch_time = sum(session.duration_minutes for session in sessions)
    avg_session_duration = total_watch_time / len(sessions)
    latest_session_str = max(session.session_end for session in sessions)
    latest_date = datetime.datetime.fromisoformat(latest_session_str.replace("Z", "+00:00")).replace(tzinfo=None)
    days_since_last = (datetime.datetime.utcnow() - latest_date).days
    days_since_last = max(0, days_since_last)

    input_features = pd.DataFrame([{
        'total_watch_time': total_watch_time,
        'days_since_last_session': days_since_last,
        'avg_session_duration': avg_session_duration
    }])

    cancel_probability = ml_model.predict_proba(input_features)[0][1] 
    
    guilt_score = round(cancel_probability * 100, 1)

    return {
        "user_id": user_id,
        "metrics_analyzed": {
            "total_watch_time_mins": round(total_watch_time, 1),
            "days_since_last_session": days_since_last,
            "avg_session_duration_mins": round(avg_session_duration, 1)
        },
        "guilt_score": guilt_score,
        "recommendation": "Cancel Subscription" if guilt_score >= 60 else "Keep Subscription"
    }