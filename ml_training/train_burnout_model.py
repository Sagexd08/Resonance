"""
Train burnout prediction model using XGBoost.
Dataset: Employee burnout challenge
"""
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import xgboost as xgb
import pickle
from pathlib import Path
import config

def load_burnout_data(data_dir):
    """Load and preprocess burnout dataset."""
    data_path = Path(data_dir)
    
                        
    csv_files = list(data_path.glob("*.csv"))
    if not csv_files:
                              
        for subdir in data_path.iterdir():
            if subdir.is_dir():
                csv_files.extend(subdir.glob("*.csv"))
    
    if not csv_files:
        raise ValueError(f"No CSV files found in {data_dir}")
    
                                                            
    df = pd.read_csv(csv_files[0])
    print(f"Loaded dataset: {csv_files[0].name}")
    print(f"Shape: {df.shape}")
    print(f"Columns: {list(df.columns)}")
    
    return df

def preprocess_data(df):
    """Preprocess the burnout dataset."""
    df = df.copy()
    
                                                                                           
    target_candidates = ['Burn Rate', 'burnout', 'Burnout', 'burn_rate', 'target']
    target_col = None
    for col in target_candidates:
        if col in df.columns:
            target_col = col
            break
    
    if target_col is None:
                                                                         
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        if len(numeric_cols) > 0:
            target_col = numeric_cols[-1]                                        
        else:
            raise ValueError("Could not identify target column")
    
    print(f"Target column: {target_col}")
    
                                  
    X = df.drop(columns=[target_col])
    y = df[target_col]
    
                                
    label_encoders = {}
    for col in X.select_dtypes(include=['object']).columns:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col].astype(str))
        label_encoders[col] = le
    
                           
    X = X.fillna(X.mean())
    
                                  
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    X_scaled = pd.DataFrame(X_scaled, columns=X.columns)
    
                                                                     
    if y.dtype in [np.float64, np.int64] and y.nunique() > 2:
        threshold = y.median()
        y_binary = (y > threshold).astype(int)
        print(f"Converted continuous target to binary (threshold: {threshold:.2f})")
        y = y_binary
    
    return X_scaled, y, scaler, label_encoders

def main():
    """Main training function."""
    print("="*60)
    print("Training Burnout Prediction Model (XGBoost)")
    print("="*60)
    
               
    print(f"\nLoading dataset from {config.BURNOUT_DATA_DIR}")
    df = load_burnout_data(config.BURNOUT_DATA_DIR)
    
                
    print("\nPreprocessing data...")
    X, y, scaler, label_encoders = preprocess_data(df)
    
    print(f"\nFeatures: {X.shape[1]}")
    print(f"Samples: {X.shape[0]}")
    print(f"Target distribution:\n{y.value_counts()}")
    
                
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
                          
    print("\nTraining XGBoost model...")
    model = xgb.XGBClassifier(
        n_estimators=config.BURNOUT_CONFIG["n_estimators"],
        max_depth=config.BURNOUT_CONFIG["max_depth"],
        learning_rate=config.BURNOUT_CONFIG["learning_rate"],
        subsample=config.BURNOUT_CONFIG["subsample"],
        colsample_bytree=config.BURNOUT_CONFIG["colsample_bytree"],
        random_state=config.BURNOUT_CONFIG["random_state"],
        eval_metric='logloss',
        use_label_encoder=False
    )
    
           
    model.fit(
        X_train, y_train,
        eval_set=[(X_test, y_test)],
        verbose=True
    )
    
              
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\n{'='*60}")
    print("Model Evaluation")
    print(f"{'='*60}")
    print(f"Test Accuracy: {accuracy:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    
                      
    print(f"\nPerforming {config.BURNOUT_CONFIG['cv_folds']}-fold cross-validation...")
    cv_scores = cross_val_score(model, X, y, cv=config.BURNOUT_CONFIG["cv_folds"], scoring='accuracy')
    print(f"CV Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")
    
                        
    print("\nTop 10 Most Important Features:")
    feature_importance = pd.DataFrame({
        'feature': X.columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    print(feature_importance.head(10))
    
                                  
    config.MODELS_DIR.mkdir(parents=True, exist_ok=True)
    
    model_data = {
        'model': model,
        'scaler': scaler,
        'label_encoders': label_encoders,
        'feature_names': list(X.columns)
    }
    
    with open(config.BURNOUT_MODEL_PATH, 'wb') as f:
        pickle.dump(model_data, f)
    
                        
    from sklearn.metrics import f1_score, confusion_matrix, classification_report
    f1 = f1_score(y_test, y_pred, average='weighted')
    f1_macro = f1_score(y_test, y_pred, average='macro')
    f1_per_class = f1_score(y_test, y_pred, average=None)
    
                      
    cm = confusion_matrix(y_test, y_pred)
    
    print(f"\n{'='*60}")
    print("Model Evaluation Metrics")
    print(f"{'='*60}")
    print(f"Test Accuracy: {accuracy:.4f}")
    print(f"Weighted F1 Score: {f1:.4f}")
    print(f"Macro F1 Score: {f1_macro:.4f}")
    print(f"\nPer-class F1 Scores:")
    class_names = ['No Burnout', 'Burnout']
    for i, (name, score) in enumerate(zip(class_names, f1_per_class)):
        print(f"  {name}: {score:.4f}")
    
    print(f"\nConfusion Matrix:")
    print(cm)
    
                                
    import matplotlib.pyplot as plt
    import seaborn as sns
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=class_names,
                yticklabels=class_names)
    plt.title('Burnout Prediction Model - Confusion Matrix')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    cm_path = config.MODELS_DIR / "burnout_confusion_matrix.png"
    plt.savefig(cm_path)
    print(f"\nConfusion matrix saved to: {cm_path}")
    
    print(f"\n{'='*60}")
    print("Training complete!")
    print(f"Test Accuracy: {accuracy:.4f}")
    print(f"Weighted F1 Score: {f1:.4f}")
    print(f"Model saved to: {config.BURNOUT_MODEL_PATH}")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()
