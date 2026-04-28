import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
import logging

logging.basicConfig(level = logging.INFO)
logger = logging.getLogger(__name__)

def generate_synthetic_data(num_samples = 5000):
    logger.info(f"Generating {num_samples} synthetic user profiles...")
    np.random.seed(42)

    total_watch_time = np.random.randint(0, 3000, num_samples)

    days_since_last_session = np.random.randint(0, 45, num_samples)

    avg_session_duration = np.random.randint(5, 120, num_samples)

    cancel_target = np.where((days_since_last_session > 14) | (total_watch_time < 120), 1, 0)

    noise = np.random.choice([0, 1], size = num_samples, p = [0.9, 0.1])
    cancel_target = np.where(noise == 1, 1 - cancel_target, cancel_target)

    df = pd.DataFrame({
        'total_watch_time': total_watch_time,
        'days_since_last_session': days_since_last_session,
        'avg_session_duration': avg_session_duration,
        'should_cancel': cancel_target
    })
    return df

def train_and_save_model():
    df = generate_synthetic_data()

    X = df[['total_watch_time', 'days_since_last_session', 'avg_session_duration']]
    y = df['should_cancel']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.2, random_state = 42)

    model = RandomForestClassifier(n_estimators = 100, max_depth = 5, random_state = 42)
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    accuracy = accuracy_score(y_test, preds)
    logger.info(f"Model trained. Test accuracy: {accuracy * 100:.2f}%")
    joblib.dump(model, 'guilt_model.pkl')
    logger.info("Model saved as 'guilt_model.pkl'")

if __name__ == "__main__":
    train_and_save_model()