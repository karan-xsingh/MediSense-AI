"""
MediSense AI - Model Evaluation & Metrics
Detailed analysis of all ML models
"""
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, roc_auc_score, confusion_matrix,
    classification_report
)
from sklearn.preprocessing import LabelEncoder
import warnings
warnings.filterwarnings('ignore')

def evaluate_diabetes():
    """Evaluate Diabetes Prediction Model"""
    print("\n" + "="*50)
    print("DIABETES MODEL EVALUATION")
    print("="*50)
    
    df = pd.read_csv('datasets/diabetes.csv')
    X = df.drop('Outcome', axis=1)
    y = df['Outcome']
    
    model = joblib.load('models/diabetes_model.pkl')
    
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    
    metrics = {
        'accuracy': cross_val_score(model, X, y, cv=cv, scoring='accuracy'),
        'precision': cross_val_score(model, X, y, cv=cv, scoring='precision'),
        'recall': cross_val_score(model, X, y, cv=cv, scoring='recall'),
        'f1': cross_val_score(model, X, y, cv=cv, scoring='f1'),
        'roc_auc': cross_val_score(model, X, y, cv=cv, scoring='roc_auc')
    }
    
    for metric, scores in metrics.items():
        print(f"{metric.upper():12} → {scores.mean()*100:.2f}% ± {scores.std()*100:.2f}%")

def evaluate_heart():
    """Evaluate Heart Disease Model"""
    print("\n" + "="*50)
    print("HEART DISEASE MODEL EVALUATION")
    print("="*50)
    
    df = pd.read_csv('datasets/heart.csv')
    X = df.drop('target', axis=1)
    y = df['target']
    
    model = joblib.load('models/heart_model.pkl')
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    
    metrics = {
        'accuracy': cross_val_score(model, X, y, cv=cv, scoring='accuracy'),
        'precision': cross_val_score(model, X, y, cv=cv, scoring='precision'),
        'recall': cross_val_score(model, X, y, cv=cv, scoring='recall'),
        'f1': cross_val_score(model, X, y, cv=cv, scoring='f1'),
        'roc_auc': cross_val_score(model, X, y, cv=cv, scoring='roc_auc')
    }
    
    for metric, scores in metrics.items():
        print(f"{metric.upper():12} → {scores.mean()*100:.2f}% ± {scores.std()*100:.2f}%")

def evaluate_kidney():
    """Evaluate Kidney Disease Model"""
    print("\n" + "="*50)
    print("KIDNEY DISEASE MODEL EVALUATION")
    print("="*50)
    
    df = pd.read_csv('datasets/kidney_disease.csv')
    df = df.drop('id', axis=1)
    df.columns = df.columns.str.strip()
    df['classification'] = df['classification'].str.strip()
    df['classification'] = df['classification'].map({'ckd': 1, 'notckd': 0})
    df = df.replace(r'^\s*\??\s*$', np.nan, regex=True)
    for col in df.columns:
        if df[col].dtype == 'object':
            df[col] = df[col].str.strip()
    df = df.fillna(df.mode().iloc[0])
    le = LabelEncoder()
    for col in df.columns:
        if df[col].dtype == 'object':
            df[col] = le.fit_transform(df[col].astype(str))
    df = df.apply(pd.to_numeric, errors='coerce').fillna(0)
    
    X = df.drop('classification', axis=1)
    y = df['classification']
    
    model = joblib.load('models/kidney_model.pkl')
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    
    metrics = {
        'accuracy': cross_val_score(model, X, y, cv=cv, scoring='accuracy'),
        'precision': cross_val_score(model, X, y, cv=cv, scoring='precision'),
        'recall': cross_val_score(model, X, y, cv=cv, scoring='recall'),
        'f1': cross_val_score(model, X, y, cv=cv, scoring='f1'),
        'roc_auc': cross_val_score(model, X, y, cv=cv, scoring='roc_auc')
    }
    
    for metric, scores in metrics.items():
        print(f"{metric.upper():12} → {scores.mean()*100:.2f}% ± {scores.std()*100:.2f}%")

if __name__ == '__main__':
    evaluate_diabetes()
    evaluate_heart()
    evaluate_kidney()
    print("\n✅ All models evaluated!")