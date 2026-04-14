import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import pickle
import os

def load_and_preprocess_data():
    print("Downloading UCI Heart Disease dataset (Cleveland)...")
    url = "https://archive.ics.uci.edu/ml/machine-learning-databases/heart-disease/processed.cleveland.data"
    
    # Define column names based on dataset dictionary
    columns = ["age", "sex", "cp", "trestbps", "chol", "fbs", "restecg", 
               "thalach", "exang", "oldpeak", "slope", "ca", "thal", "target"]
    
    df = pd.read_csv(url, names=columns)
    
    # Replace '?' with NaN and drop missing values for simplicity
    df.replace("?", np.nan, inplace=True)
    df = df.dropna()
    
    # Convert numerical columns back to float
    df = df.astype(float)
    
    # The target attribute contains values from 0 (no presence) to 4.
    # We will convert this into a binary classification problem: 0 = No disease, 1 = Disease present
    df['target'] = df['target'].apply(lambda x: 1 if x > 0 else 0)
    
    return df

def train_model():
    df = load_and_preprocess_data()
    
    X = df.drop(columns=['target'])
    y = df['target']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training Random Forest Classifier...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate model
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {acc * 100:.2f}%")
    print("Classification Report:")
    print(classification_report(y_test, y_pred))
    
    return model, X.columns

if __name__ == "__main__":
    model, feature_names = train_model()
    
    # Ensure models directory exists
    models_dir = os.path.join(os.path.dirname(__file__), '..', 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    # Save the model
    model_path = os.path.join(models_dir, 'heart_disease_rf.pkl')
    print(f"Saving model to {model_path}...")
    
    with open(model_path, 'wb') as f:
        # We save both the model and the feature names for the API later
        pickle.dump({'model': model, 'features': list(feature_names)}, f)
        
    print("Success! Heart Disease model is ready.")
