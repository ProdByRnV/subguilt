from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

SQLALCHEMY__DATABASE_URL = "sqlite:///./subguilt.db"

engine = create_engine(SQLALCHEMY__DATABASE_URL, connect_args = {"check_same_thread": False})

SessionLocal = sessionmaker(autocommit = False, autoflush = False, bind = engine)

Base = declarative_base()

class DBSessionRecord(Base):
    __tablename__ = "watch_sessions"

    id = Column(Integer, primary_key = True, index = True)
    user_id = Column(String, index = True)
    platform = Column(String, index = True)
    event_type = Column(String)
    session_start = Column(String)
    session_end = Column(String)
    duration_minutes = Column(Float)
    device_type = Column(String)
    synced_at = Column(DateTime, default = datetime.datetime.utcnow)

Base.metadata.create_all(bind = engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()